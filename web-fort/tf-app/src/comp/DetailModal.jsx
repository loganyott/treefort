import React from 'react'
import { SocialLinks } from './Cards.jsx'
require('tachyons')
import Moment from 'moment'
import { extendMoment } from 'moment-range'
import bgimg from '../../../assets/doodles/artistpattern.png'

const moment = extendMoment(Moment)
const wedsRange = moment.range('2017-03-22T05:00:00/2017-03-23T04:00:00')
const thursRange = moment.range('2017-03-23T05:00:00/2017-03-24T04:00:00')
const friRange = moment.range('2017-03-24T05:00:00/2017-03-25T04:00:00')
const satRange = moment.range('2017-03-25T05:00:00/2017-03-26T04:00:00')
const sunRange = moment.range('2017-03-26T05:00:00/2017-03-28T04:00:00')

/**
 * Background images
 */
import cardPlaceholderImage from '../../../assets/images/targetInvert-250x300.png'
import footerperson from '../../../assets/images/footerperson.png'

const compareDates = (a, b) => {
  if (moment(a.get('start_time')).isBefore(moment(b.get('start_time')))) {
    return -1
  }
  if (moment(a.get('start_time')).isAfter(moment(b.get('start_time')))) {
    return 1
  }
  if (moment(a.get('start_time')).isSame(moment(b.get('start_time')))) {
    return 0
  }
  return
}

const eventTime = (e) => {
  if (e === undefined) { return }
  
  const cancelled = e.get('cancelled')
  const address = e.get('venue').get('street')
  //console.log(e.toJSON())

  let dayRange = ''
  // Put event into the day's bucket
  if (wedsRange.contains(moment(e.get('start_time')))) {
    dayRange = 'Wednesday'
  }
  if (thursRange.contains(moment(e.get('start_time')))) {
    dayRange = 'Thursday'
  }
  if (friRange.contains(moment(e.get('start_time')))) {
    dayRange = 'Friday'
  }
  if (satRange.contains(moment(e.get('start_time')))) {
    dayRange = 'Saturday'
  }
  if (sunRange.contains(moment(e.get('start_time')))) {
    dayRange = 'Sunday'
  }

  const eDay = moment().day(moment(e.get('start_time')).weekday()).format('dddd')
  const realDay = moment(e.get('start_time')).format('dddd')
  const dispDay = dayRange === realDay ? dayRange : `${dayRange} Night / ${realDay} Morning`
  const venuemap = 'https://www.google.com/maps?q=' + e.get('venue').get('street')
  return (
    <div className={`center tracked items-center item-sched`}>
      <div className={cancelled ? 'strike red' : ''}>
        <h2 style={{ color: 'rgba(252,215,56,1)', margin: '40px 0' }}>{dispDay}</h2>
        <p>{moment(e.get('start_time')).format('h:mma')} - {e.get('venue').get('name')}<br /><a href={venuemap} target='_blank' className='street'><span className={address ? '' : 'hide'} ><i className='fa fa-map-marker ' aria-hidden='true'></i>{address}</span></a></p>
      </div>
      { cancelled
        ?  <div className='red'><h3>CANCELLED</h3></div>
        : ''
      }
    </div>
  )
}

export default ({item, event}) => {
  const song = item.get('song')

  let bioLines = item.get('bio') ? item.get('bio').split('\n') : ['']

  return (
    <div>
      <header className='col-xs-12' style={{ background:`#000 url('${bgimg}')`}}>
        <div  className='container'>
          <div className='col-xs-12 col-md-6'>
            <img src={`${item.get('image_url_med') ? item.get('image_url_med') : cardPlaceholderImage}`}
              alt={item.get('name')}
              className='img-responsive center'
              role='presentation'
              style={{ marginBottom: '40px', maxWidth: '90%', boxShadow: '17px 17px 0px 0px rgba(252,215,56,1)'}}
            />
          </div>
          <div className='col-xs-12 col-md-6'>
          <h1 style={{ color: 'rgba(252,215,56,1)' }}>{item.get('name')}</h1>
          <h3 style={{ fontSize: '34px' }}>{item.get('home_town')}</h3>
          <p><SocialLinks item={item} /></p>
          {song.get('stream_url') && <div>            
          {song
              ? (
                <audio controls='controls' className='mt4 w-100'>
                  <source src={song.get('stream_url')} type='audio/mp3' />
                </audio>
              ) : null
            }
            </div>}

          </div>
        </div>
      </header>

      <div className='col-xs-12' style={{ background:'rgb(20, 106, 165)'}}>
        <div className='container'>
          <div className='col-xs-12 col-md-6'>
            <h2 style={{ color: 'rgba(252,215,56,1)', margin: '40px 0' }}>BIO</h2>
            {bioLines.map((l, k) => <p className='lh-copy measure mt4 mt0-ns' key={k}>{l}</p>)}        
          </div>
          <div className='col-xs-12 col-md-6'>
            {event && event.size > 0 ? event.sort((a, b) => compareDates(a, b)).map(e => eventTime(e)) : null}
          </div>
        </div>
          <img src={footerperson} style={{ float: 'right', marginRight: '-15px', marginTop: '-40px' }} />
      </div>
    </div>
  )
}
