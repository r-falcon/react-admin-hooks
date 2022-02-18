import React from 'react'
import { isLogin } from '@/utils/auth'
import { Redirect } from 'react-router'

function BasicLayout() {
  if (isLogin()) {
    return <h2>logined out</h2>
  } else {
    return <Redirect to="/login" />
  }
}

export default BasicLayout
