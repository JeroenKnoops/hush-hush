import React from 'react'
import { Red } from '../ui'

const NoInvitation = () => (
  <div css={{ display: 'flex', flexFlow: 'column nowrap', alignItems: 'center', width: '100%' }}>
    <div>
      <Red>Oops!!!</Red> I could not find any potential invitation in your url.
    </div>
    <div>
      Please check that you copied and pasted the whole url from your email.
    </div>
    <div css={{ marginTop: '20px' }}>
      Don't give up. Let's hush something!
    </div>
  </div>
)

export { NoInvitation }
