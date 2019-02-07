import React from 'react'
import { Red } from '../ui'

const NoSecret = () => (
  <div css={{ display: 'flex', flexFlow: 'column nowrap', alignItems: 'center', width: '100%' }}>
    <div>
      <Red>Hush!</Red> Your link to get the secret does not look well to me.
    </div>
    <div>
      Please check that you copied and pasted the whole url from your email.
    </div>
    <div css={{ marginTop: '20px' }}>
      Don't give up. Check with the sender, and keep hushing!
    </div>
  </div>
)

export { NoSecret }
