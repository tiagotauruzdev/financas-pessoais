import { supabase, Tables } from './supabase.service'

export type Profile = Tables<'profiles'>

export const profileService = {
  async getCurrentProfile() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuário não autenticado')

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('Erro ao obter perfil:', error)
      throw error
    }
    return data
  },

  async updateProfile(profile: Partial<Profile>) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuário não autenticado')

    try {
      // Remover email das atualizações para garantir que não seja alterado
      const { email, ...updateData } = profile

      // Se houver uma imagem em base64, fazer upload primeiro
      if (updateData.avatar_url?.startsWith('data:image')) {
        try {
          const avatarUrl = await this.uploadAvatar(updateData.avatar_url)
          updateData.avatar_url = avatarUrl
        } catch (error) {
          console.error('Erro ao fazer upload do avatar:', error)
          throw new Error('Erro ao fazer upload da imagem de perfil: ' + (error instanceof Error ? error.message : String(error)))
        }
      }

      // Primeiro, obter o perfil atual
      const currentProfile = await this.getCurrentProfile()
      if (!currentProfile) throw new Error('Perfil não encontrado')

      // Mesclar o perfil atual com as atualizações
      const updatedProfile = {
        ...currentProfile,
        ...updateData,
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('profiles')
        .update(updatedProfile)
        .eq('id', user.id)
        .select()
        .single()

      if (error) {
        console.error('Erro ao atualizar perfil:', error)
        throw new Error('Erro ao atualizar informações do perfil: ' + error.message)
      }

      return data
    } catch (error) {
      console.error('Erro geral ao atualizar perfil:', error)
      throw error
    }
  },

  async uploadAvatar(base64Image: string): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuário não autenticado')

    try {
      // Converter base64 para blob
      const base64Data = base64Image.split(',')[1]
      const byteCharacters = atob(base64Data)
      const byteArrays = []
      
      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512)
        const byteNumbers = new Array(slice.length)
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i)
        }
        const byteArray = new Uint8Array(byteNumbers)
        byteArrays.push(byteArray)
      }
      
      const blob = new Blob(byteArrays, { type: 'image/jpeg' })

      // Criar nome do arquivo com estrutura de pasta
      const fileName = `${user.id}/avatar-${Date.now()}.jpg`

      try {
        // Remover avatar antigo se existir
        const { data: oldFiles, error: listError } = await supabase.storage
          .from('avatars')
          .list(user.id)

        if (listError) {
          console.error('Erro ao listar arquivos:', listError)
        } else if (oldFiles?.length) {
          const { error: removeError } = await supabase.storage
            .from('avatars')
            .remove(oldFiles.map(file => `${user.id}/${file.name}`))
          
          if (removeError) {
            console.error('Erro ao remover arquivos antigos:', removeError)
          }
        }
      } catch (error) {
        console.error('Erro ao gerenciar arquivos antigos:', error)
      }

      // Upload do novo avatar
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(fileName, blob, {
          contentType: 'image/jpeg',
          upsert: true
        })

      if (uploadError) {
        console.error('Erro no upload:', uploadError)
        throw new Error('Erro no upload: ' + uploadError.message)
      }

      if (!data) {
        throw new Error('Upload falhou: nenhum dado retornado')
      }

      // Obter a URL pública do avatar
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      return publicUrl
    } catch (error) {
      console.error('Erro no upload do avatar:', error)
      throw new Error('Erro ao fazer upload da imagem: ' + (error instanceof Error ? error.message : String(error)))
    }
  },

  async addXP(xpAmount: number) {
    const profile = await this.getCurrentProfile()
    if (!profile) throw new Error('Perfil não encontrado')

    const newXP = (profile.xp || 0) + xpAmount
    const newLevel = Math.floor(newXP / 1000) + 1

    return this.updateProfile({ 
      xp: newXP,
      level: newLevel
    })
  },

  async addAchievement(achievement: string) {
    const profile = await this.getCurrentProfile()
    if (!profile) throw new Error('Perfil não encontrado')

    const achievements = [...(profile.achievements || []), achievement]

    return this.updateProfile({ achievements })
  }
}
