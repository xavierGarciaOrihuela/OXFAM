import * as AiIcons from 'react-icons/ai';
import * as BsIcons from 'react-icons/bs';
import * as PiIcons from 'react-icons/pi';

export const SidebarData = [
    {
        title: 'Home',
        path: '/',
        icon: <AiIcons.AiOutlineHome />,
    },
    {
        title: 'Documents',
        path: '/documents',
        icon: <BsIcons.BsFiles/>,
    },
    {
        title: 'Chat',
        path: '/chat',
        icon: <PiIcons.PiChatsCircle />,
    }
]

export default SidebarData;