import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getSession, isAuthenticated, useSession } from '@/lib/auth'
import { redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/')({
  component: IndexComponent,
  beforeLoad: async ({ location }) => {
    if (!(await isAuthenticated())) {
      throw redirect({
        to: '/signup',
        search: {
          redirect: location.href,
        },
      })
    }
  },
})

function IndexComponent() {
  return <div className="flex items-center justify-center pt-36">home page</div>
}
