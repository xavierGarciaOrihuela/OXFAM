import * as AiIcons from 'react-icons/ai';
import * as BsIcons from 'react-icons/bs';

export const SidebarData = [
    {
        title: 'Home',
        path: '/',
        icon: <AiIcons.AiOutlineHome />,
    },
    {
        title: 'Documents',
        path: '/documents',
        icon: <BsIcons.BsFileEarmarkPdf/>,
    },
    {
        title: 'Search',
        path: '/search',
        icon: <AiIcons.AiOutlineSearch />,
    }
]

export default SidebarData;