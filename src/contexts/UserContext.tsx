import { createContext, useContext, useEffect, useState } from 'react'
import { Profile, profileService } from '../services/profile.service'

interface UserContextData {
  userProfile: Profile | null
  loading: boolean
  updateProfile: (profile: Partial<Profile>) => Promise<Profile>
  addXP: (amount: number) => Promise<Profile>
  addAchievement: (achievement: string) => Promise<Profile>
}

const UserContext = createContext<UserContextData>({} as UserContextData)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userProfile, setUserProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUserProfile()
  }, [])

  async function loadUserProfile() {
    try {
      const profile = await profileService.getCurrentProfile()
      setUserProfile(profile)
    } catch (error) {
      console.error('Erro ao carregar perfil:', error)
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile(profileData: Partial<Profile>) {
    try {
      const updatedProfile = await profileService.updateProfile(profileData)
      setUserProfile(updatedProfile)
      return updatedProfile
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      throw error
    }
  }

  async function addXP(amount: number) {
    try {
      const updatedProfile = await profileService.addXP(amount)
      setUserProfile(updatedProfile)
      return updatedProfile
    } catch (error) {
      console.error('Erro ao adicionar XP:', error)
      throw error
    }
  }

  async function addAchievement(achievement: string) {
    try {
      const updatedProfile = await profileService.addAchievement(achievement)
      setUserProfile(updatedProfile)
      return updatedProfile
    } catch (error) {
      console.error('Erro ao adicionar conquista:', error)
      throw error
    }
  }

  return (
    <UserContext.Provider 
      value={{ 
        userProfile, 
        loading,
        updateProfile,
        addXP,
        addAchievement
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser deve ser usado dentro de um UserProvider')
  }
  return context
}
