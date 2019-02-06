import React from 'react'
import { PageCentered } from '@react-frontend-developer/react-layout-helpers'
import { FadingValueBox } from '../components/animations'

import { InviteHush } from '../components/invite'

const Invite = () => (
  <PageCentered css={{ color: 'white' }}>
    <div css={{ display: 'flex', flexFlow: 'column nowrap', alignItems: 'center', minHeight: '150px', maxWidth: '550px', width: '85%' }}>
      <FadingValueBox>
        <InviteHush />
      </FadingValueBox>
    </div>
  </PageCentered>
)

export default Invite
