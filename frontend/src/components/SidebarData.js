import * as AiIcons from 'react-icons/ai';
import * as BsIcons from 'react-icons/bs';
import * as PiIcons from 'react-icons/pi';

export const SidebarData = [
    {
        title: 'Home',
        path: '/home',
        icon: <AiIcons.AiOutlineHome />,
    },
    {
        title: 'Documents',
        path: '/home/documents',
        icon: <BsIcons.BsFiles/>,
    },
    {
        title: 'Chat',
        path: '/home/chat',
        icon: <PiIcons.PiChatsCircle />,
    }
]

export default SidebarData;