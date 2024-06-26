'use client';

import useClasses from '../use-classes';
import Avatar from '../avatar';
import Popover from '../popover';
import useScale, { withScale } from '../use-scale';

import React, { PropsWithChildren } from 'react';

export interface UserProfileMenuProps {
  name?: string;
}
const UserProfileComponent: React.FC<PropsWithChildren<UserProfileMenuProps>> = ({ children, name }) => {
  const { UNIT, SCALE, CLASS_NAMES } = useScale();
  return (
    <div className={useClasses('user-profile-menu', CLASS_NAMES)}>
      <Popover className="menu-popover" offset={8} ml={3} placement="bottomEnd" trigger="click" enterDelay={0} leaveDelay={0} content={children}>
        <Avatar text={name} scale={1.2}></Avatar>
      </Popover>
      <style jsx>{`
        :global(.menu-popover) {
          display: inline-flex !important;
        }
        .user-profile-menu {
          display: inline-flex;
        }

        ${SCALE.padding(0, value => `padding: ${value.top} ${value.right} ${value.bottom} ${value.left};`, undefined, 'user-profile-menu')}
        ${SCALE.margin(0, value => `margin: ${value.top} ${value.right} ${value.bottom} ${value.left};`, undefined, 'user-profile-menu')}
        ${UNIT('user-profile-menu')}
      `}</style>
    </div>
  );
};

UserProfileComponent.displayName = 'HimalayaUserProfile';
const UserProfileMenu = withScale(UserProfileComponent);
export default UserProfileMenu;
