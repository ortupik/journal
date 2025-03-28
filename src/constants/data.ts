import { NavItem } from 'types';

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard/',
    icon: 'dashboard',
    isActive: true,
    shortcut: ['d', 'd'],
    items: []
  },
  {
    title: 'Summary',
    url: '/dashboard/summary',
    icon: 'chart',
    shortcut: ['p', 'p'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Settings',
    url: '#',
    icon: 'settings',
    isActive: true,

    items: [
      {
        title: 'Profile',
        url: '/dashboard/profile',
        icon: 'userx',
        shortcut: ['m', 'm']
      }
    ]
  }
];
