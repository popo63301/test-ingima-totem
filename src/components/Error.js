import React from 'react'

export default function Error({ error }) {
  console.log(error)
  return (
    <div
      style={{
        margin: '20px 0',
        borderRadius: '5px',
        width: '100%',
        height: '100%',
        backgroundColor: '#ff5959',
        color: 'white',
        fontSize: '30px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      {error.message || 'Error'}
    </div>
  )
}
