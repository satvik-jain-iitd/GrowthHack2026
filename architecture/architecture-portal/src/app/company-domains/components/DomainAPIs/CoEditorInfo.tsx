import { useUserInfo } from '@/hooks/useUserInfo'
import { UserAvatar } from '../UserAvatar'

export const CoEditorInfo = ({ email }: { email: string }) => {
    const { userInfo } = useUserInfo(email)

    return (
        <div className='co-editor-info'>
            <UserAvatar email={email} name={userInfo?.displayName} />
        </div>
    )
}
