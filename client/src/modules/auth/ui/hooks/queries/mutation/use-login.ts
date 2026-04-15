import { useMutation } from '@tanstack/vue-query'
import { useDependencies } from '@/modules/app/ui/hooks/use-dependencies'
import { getSharedHttpClient } from '@/modules/shared/http/http-client'
import type { AuthDomainModel } from '@/modules/auth/core/model/auth.domain-model'

export function useLogin() {
  const { authPort } = useDependencies()
  return useMutation({
    mutationKey: ['login'],
    mutationFn: (data: AuthDomainModel.LoginDto) => authPort.login(data),
    onSuccess: (result) => {
      localStorage.setItem('token', result.token)
      getSharedHttpClient().setAuthToken(result.token)
    },
  })
}
