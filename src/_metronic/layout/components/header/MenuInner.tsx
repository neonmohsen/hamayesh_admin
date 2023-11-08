import {MenuItem} from './MenuItem'
import {MenuInnerWithSub} from './MenuInnerWithSub'
import {MegaMenu} from './MegaMenu'
import {useIntl} from 'react-intl'

export function MenuInner() {
  const intl = useIntl()
  return (
    <>
      {/* <MenuItem title={intl.formatMessage({id: 'MENU.DASHBOARD'})} to='/dashboard' />
      <MenuItem title='Layout Builder' to='/builder' />
      <MenuInnerWithSub
        title='Crafted'
        to='/crafted'
        menuPlacement='bottom-start'
        menuTrigger='click'
      >
        <MenuInnerWithSub
          title='Pages'
          to='/crafted/pages'
          icon='element-plus'
          hasArrow={true}
          menuPlacement='left-start'
          menuTrigger={`{default:'click', lg: 'hover'}`}
        >
          <MenuInnerWithSub
            title='Profile'
            to='/crafted/pages/profile'
            hasArrow={true}
            hasBullet={true}
            menuPlacement='left-start'
            menuTrigger={`{default:'click', lg: 'hover'}`}
          >
            <MenuItem to='/crafted/pages/profile/overview' title='Overview' hasBullet={true} />
            <MenuItem to='/crafted/pages/profile/projects' title='Projects' hasBullet={true} />
            <MenuItem to='/crafted/pages/profile/campaigns' title='Campaigns' hasBullet={true} />
            <MenuItem to='/crafted/pages/profile/documents' title='Documents' hasBullet={true} />
            <MenuItem
              to='/crafted/pages/profile/connections'
              title='Connections'
              hasBullet={true}
            />
          </MenuInnerWithSub>
          <MenuInnerWithSub
            title='Wizards'
            to='/crafted/pages/wizards'
            hasArrow={true}
            hasBullet={true}
            menuPlacement='left-start'
            menuTrigger={`{default:'click', lg: 'hover'}`}
          >
            <MenuItem to='/crafted/pages/wizards/horizontal' title='Horizontal' hasBullet={true} />
            <MenuItem to='/crafted/pages/wizards/vertical' title='Vertical' hasBullet={true} />
          </MenuInnerWithSub>
        </MenuInnerWithSub>

        <MenuInnerWithSub
          title='Accounts'
          to='/crafted/accounts'
          icon='profile-circle'
          hasArrow={true}
          menuPlacement='left-start'
          menuTrigger={`{default:'click', lg: 'hover'}`}
        >
          <MenuItem to='/crafted/account/overview' title='Overview' hasBullet={true} />
          <MenuItem to='/crafted/account/settings' title='Settings' hasBullet={true} />
        </MenuInnerWithSub>

        <MenuInnerWithSub
          title='Errors'
          to='/error'
          icon='fingerprint-scanning'
          hasArrow={true}
          menuPlacement='left-start'
          menuTrigger={`{default:'click', lg: 'hover'}`}
        >
          <MenuItem to='/error/404' title='Error 404' hasBullet={true} />
          <MenuItem to='/error/500' title='Error 500' hasBullet={true} />
        </MenuInnerWithSub>

        <MenuInnerWithSub
          title='Widgets'
          to='/crafted/widgets'
          icon='element-11'
          hasArrow={true}
          menuPlacement='left-start'
          menuTrigger={`{default:'click', lg: 'hover'}`}
        >
          <MenuItem to='/crafted/widgets/lists' title='Lists' hasBullet={true} />
          <MenuItem to='/crafted/widgets/statistics' title='Statistics' hasBullet={true} />
          <MenuItem to='/crafted/widgets/charts' title='Charts' hasBullet={true} />
          <MenuItem to='/crafted/widgets/mixed' title='Mixed' hasBullet={true} />
          <MenuItem to='/crafted/widgets/tables' title='Tables' hasBullet={true} />
          <MenuItem to='/crafted/widgets/feeds' title='Feeds' hasBullet={true} />
        </MenuInnerWithSub>
      </MenuInnerWithSub> */}

      <MenuInnerWithSub title='Apps' to='/apps' menuPlacement='bottom-start' menuTrigger='click'>
        {/* PAGES */}
        {/* <MenuInnerWithSub
          title='Chat'
          to='/apps/chat'
          icon='message-text-2'
          hasArrow={true}
          menuPlacement='left-start'
          menuTrigger={`{default:'click', lg: 'hover'}`}
        >
          <MenuItem to='/apps/chat/private-chat' title='Private Chat' hasBullet={true} />
          <MenuItem to='/apps/chat/group-chat' title='Group Chart' hasBullet={true} />
          <MenuItem to='/apps/chat/drawer-chat' title='Drawer Chart' hasBullet={true} />
        </MenuInnerWithSub> */}
        <MenuItem icon='shield-tick' to='/apps/user-management/users' title='مدیریت کاربران' />
        <MenuItem
          icon='shield-tick'
          to='/apps/supporter-management/supporters'
          title='مدیریت حامیان'
        />
        <MenuItem
          icon='shield-tick'
          to='/apps/speaker-management/speakers'
          title='مدیریت سخنرانان'
        />
        <MenuItem icon='shield-tick' to='/apps/slider-management/sliders' title='مدیریت اسلایدر' />
        <MenuItem
          icon='shield-tick'
          to='/apps/secretariat-management/secretariats'
          title='مدیریت دبیرخانه ها'
        />
        <MenuItem
          icon='shield-tick'
          to='/apps/question-management/questions'
          title='مدیریت سوالات متداول'
        />
        <MenuItem
          icon='shield-tick'
          to='/apps/organizer-management/organizers'
          title='مدیریت برگذار کننده ها'
        />
        <MenuItem
          icon='shield-tick'
          to='/apps/newstag-management/newstags'
          title='مدیریت تگ های خبر'
        />
        <MenuItem
          icon='shield-tick'
          to='/apps/newscomment-management/newscomments'
          title='مدیریت کامنت های خبر'
        />
        <MenuItem
          icon='shield-tick'
          to='/apps/newscategory-management/newscategories'
          title='مدیریت دسته بندی اخبار'
        />

        <MenuItem icon='shield-tick' to='/apps/news-management/news' title='مدیریت اخبار' />
        <MenuItem
          icon='shield-tick'
          to='/apps/articlecategories-management/articlecategories'
          title='مدیریت دسته بندی مقالات'
        />
        <MenuItem icon='shield-tick' to='/apps/axies-management/axies' title='مدیریت محور ها' />
        <MenuItem icon='shield-tick' to='/apps/article-management/articles' title='مدیریت مقالات' />
      </MenuInnerWithSub>
      {/* <MenuInnerWithSub
        isMega={true}
        title='Mega menu'
        to='/mega-menu'
        menuPlacement='bottom-start'
        menuTrigger='click'
      >
        <MegaMenu />
      </MenuInnerWithSub> */}
    </>
  )
}
