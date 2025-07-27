import React, { useEffect } from 'react'

// Display Ad Component (Banner)
export function DisplayAd({ className = "" }) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (err) {
      console.error('AdSense error:', err)
    }
  }, [])

  return (
    <div className={`w-full ${className}`}>
      <ins 
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-5959064414686434"
        data-ad-slot="3544467029"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}

// In-Article Ad Component
export function InArticleAd({ className = "" }) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (err) {
      console.error('AdSense error:', err)
    }
  }, [])

  return (
    <div className={`w-full my-8 ${className}`}>
      <ins 
        className="adsbygoogle"
        style={{ display: 'block', textAlign: 'center' }}
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client="ca-pub-5959064414686434"
        data-ad-slot="1032702376"
      />
    </div>
  )
}

// Multiplex Ad Component
export function MultiplexAd({ className = "" }) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (err) {
      console.error('AdSense error:', err)
    }
  }, [])

  return (
    <div className={`w-full my-8 ${className}`}>
      <ins 
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-format="autorelaxed"
        data-ad-client="ca-pub-5959064414686434"
        data-ad-slot="9841130687"
      />
    </div>
  )
}

