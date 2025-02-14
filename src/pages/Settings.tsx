import { useState, useEffect } from 'react';
import { User, Bell, Shield, Camera, Edit2, Save, Mail, Phone, Calendar, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { toast } from 'react-toastify';
import { subscriptionService, type Subscription } from '../services/subscription.service';

const Settings = () => {
  const { userProfile, updateProfile } = useUser();
  const [name, setName] = useState(userProfile?.name || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [notifications, setNotifications] = useState({
    push: true,
    whatsapp: false,
    telegram: false,
    budget: true
  });

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione apenas arquivos de imagem');
      return;
    }

    // Validar tamanho (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 5MB');
      return;
    }

    try {
      setIsLoading(true);
      const reader = new FileReader();
      
      reader.onload = async () => {
        try {
          const base64Image = reader.result as string;
          await handleSave({ avatar_url: base64Image });
          toast.success('Foto de perfil atualizada com sucesso!');
        } catch (error) {
          console.error('Erro ao processar imagem:', error);
          toast.error('Erro ao atualizar foto de perfil. Tente novamente.');
        } finally {
          setIsLoading(false);
        }
      };

      reader.onerror = () => {
        setIsLoading(false);
        toast.error('Erro ao ler o arquivo. Tente novamente.');
      };

      reader.readAsDataURL(file);
    } catch (error) {
      setIsLoading(false);
      console.error('Erro ao processar arquivo:', error);
      toast.error('Erro ao processar arquivo. Tente novamente.');
    }
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
    setHasChanges(true);
  };

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
      value = value.replace(/(\d{5})(\d)/, '$1-$2');
      setPhone(value);
      setHasChanges(true);
    }
  };

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    setHasChanges(true);
  };

  const handleSave = async (additionalData = {}) => {
    try {
      setIsLoading(true);
      await updateProfile({
        name,
        phone,
        ...additionalData
      });
      setHasChanges(false);
      if (!additionalData.avatar_url) {
        toast.success('Alterações salvas com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao salvar alterações:', error);
      toast.error('Erro ao salvar alterações. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      const data = await subscriptionService.getCurrentSubscription();
      setSubscription(data);
    } catch (error) {
      console.error('Erro ao carregar dados da assinatura:', error);
      toast.error('Erro ao carregar informações do plano');
    }
  };

  const handleCancelSubscription = async () => {
    try {
      setIsLoading(true);
      await subscriptionService.cancelSubscription();
      await loadSubscription();
      toast.success('Assinatura cancelada com sucesso');
    } catch (error) {
      console.error('Erro ao cancelar assinatura:', error);
      toast.error('Erro ao cancelar assinatura');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReactivateSubscription = async () => {
    try {
      setIsLoading(true);
      await subscriptionService.reactivateSubscription();
      await loadSubscription();
      toast.success('Assinatura reativada com sucesso');
    } catch (error) {
      console.error('Erro ao reativar assinatura:', error);
      toast.error('Erro ao reativar assinatura');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Configurações
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie suas preferências e informações da conta
          </p>
        </div>
        {hasChanges && (
          <button
            onClick={() => handleSave()}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isLoading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        )}
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Perfil Card */}
        <div className="bg-white dark:bg-navy-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-navy-700 hover:border-gray-200 dark:hover:border-navy-600 transition-colors">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-500/10 dark:bg-blue-500/20 rounded-lg">
              <User className="w-6 h-6 text-blue-500 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Perfil</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Suas informações pessoais</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <img
                  src={userProfile?.avatar_url || 'https://via.placeholder.com/100'}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 dark:border-navy-600"
                />
                <label
                  htmlFor="avatar-upload"
                  className={`absolute bottom-0 right-0 p-1.5 bg-blue-500 text-white rounded-full cursor-pointer hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Camera className="w-4 h-4" />
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={isLoading}
                  />
                </label>
              </div>
              {isLoading && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Processando imagem...</p>
              )}
            </div>

            {/* Nome */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nome
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  className="w-full px-3 py-2 bg-white dark:bg-navy-900 border border-gray-300 dark:border-navy-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 dark:text-white transition-colors"
                  placeholder="Seu nome completo"
                />
                <Edit2 className="w-4 h-4 text-gray-400 dark:text-gray-500 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Email - Somente leitura */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={userProfile?.email || ''}
                  readOnly
                  className="w-full px-3 py-2 bg-gray-100 dark:bg-navy-700 border border-gray-300 dark:border-navy-600 rounded-lg focus:outline-none dark:text-gray-400 cursor-not-allowed"
                />
                <Mail className="w-4 h-4 text-gray-400 dark:text-gray-500 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">O email não pode ser alterado</p>
            </div>

            {/* Telefone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Telefone
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  className="w-full px-3 py-2 bg-white dark:bg-navy-900 border border-gray-300 dark:border-navy-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 dark:text-white transition-colors"
                  placeholder="(00) 00000-0000"
                />
                <Phone className="w-4 h-4 text-gray-400 dark:text-gray-500 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>
        </div>

        {/* Plano Card */}
        <div className="bg-white dark:bg-navy-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-navy-700 hover:border-gray-200 dark:hover:border-navy-600 transition-colors">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-green-500/10 dark:bg-green-500/20 rounded-lg">
              <Shield className="w-6 h-6 text-green-500 dark:text-green-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Plano</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Informações da sua assinatura</p>
            </div>
          </div>

          <div className="space-y-4">
            {subscription ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Plano Atual
                  </span>
                  <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full 
                    ${subscription.plan_type === 'premium' ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-800 dark:text-purple-300' : 
                      subscription.plan_type === 'basic' ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300' : 
                      'bg-gray-100 dark:bg-gray-600/30 text-gray-800 dark:text-gray-300'}`}>
                    {subscription.plan_type === 'premium' ? 'Premium' :
                     subscription.plan_type === 'basic' ? 'Básico' : 'Gratuito'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Status
                  </span>
                  <span className={`flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium rounded-full 
                    ${subscription.status === 'active' ? 'bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-300' : 
                      subscription.status === 'cancelled' ? 'bg-red-100 dark:bg-red-500/20 text-red-800 dark:text-red-300' : 
                      'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-800 dark:text-yellow-300'}`}>
                    {subscription.status === 'active' ? (
                      <><CheckCircle2 className="w-3 h-3" /> Ativo</>
                    ) : subscription.status === 'cancelled' ? (
                      <><X className="w-3 h-3" /> Cancelado</>
                    ) : (
                      <><AlertCircle className="w-3 h-3" /> Expirado</>
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Renovação Automática
                  </span>
                  <span className={`text-sm ${subscription.auto_renew ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {subscription.auto_renew ? 'Ativada' : 'Desativada'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Validade
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(subscription.end_date).toLocaleDateString()}
                  </span>
                </div>

                <div className="mt-6">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Recursos Inclusos
                  </div>
                  <ul className="space-y-2">
                    {subscription.features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <CheckCircle2 className="w-4 h-4 text-green-500 dark:text-green-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6">
                  {subscription.status === 'active' ? (
                    <button
                      onClick={handleCancelSubscription}
                      disabled={isLoading}
                      className="w-full px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors disabled:opacity-50"
                    >
                      {isLoading ? 'Processando...' : 'Cancelar Assinatura'}
                    </button>
                  ) : (
                    <button
                      onClick={handleReactivateSubscription}
                      disabled={isLoading}
                      className="w-full px-4 py-2 text-sm font-medium text-white bg-green-500 dark:bg-green-600 rounded-lg hover:bg-green-600 dark:hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {isLoading ? 'Processando...' : 'Reativar Assinatura'}
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center text-gray-600 dark:text-gray-400">
                Carregando informações do plano...
              </div>
            )}
          </div>
        </div>

        {/* Notificações Card */}
        <div className="bg-white dark:bg-navy-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-navy-700 hover:border-gray-200 dark:hover:border-navy-600 transition-colors">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-purple-500/10 dark:bg-purple-500/20 rounded-lg">
              <Bell className="w-6 h-6 text-purple-500 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notificações</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Configure suas notificações</p>
            </div>
          </div>

          <div className="space-y-4">
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                  {key === 'push' ? 'Notificações Push' :
                   key === 'whatsapp' ? 'WhatsApp' :
                   key === 'telegram' ? 'Telegram' :
                   key === 'budget' ? 'Alertas de Orçamento' : key}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={() => handleNotificationChange(key as keyof typeof notifications)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 dark:bg-navy-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-navy-500 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-navy-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
