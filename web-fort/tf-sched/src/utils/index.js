import { Map, List, Set } from 'immutable'
import Moment from 'moment'
import { extendMoment } from 'moment-range'

const moment = extendMoment(Moment)

const festRange = moment.range('2017-03-22T05:00:00/2017-03-28T04:00:00')

const wedsRange = moment.range('2017-03-22T05:00:00/2017-03-23T04:00:00')
const thursRange = moment.range('2017-03-23T05:00:00/2017-03-24T04:00:00')
const friRange = moment.range('2017-03-24T05:00:00/2017-03-25T04:00:00')
const satRange = moment.range('2017-03-25T05:00:00/2017-03-26T04:00:00')
const sunRange = moment.range('2017-03-26T05:00:00/2017-03-28T04:00:00')

export let venueSet = Set()

export const festGoingOn = (time) => moment(time).within(festRange)

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

export const preprocess = (events, time, hidePastEvents) => {
  const tDay = moment().day(time.weekday()).format('dddd')
  const byDate = events.reduce((p, e) => {
    const eDay = moment().day(moment(e.get('start_time')).weekday()).format('dddd')
    // Put event into the day's bucket
    if (wedsRange.contains(moment(e.get('start_time')))) {
      if (hidePastEvents && eDay === tDay) {
        if (moment(e.get('start_time')).isAfter(time)) {
          e = e.set('day', 'Wednesday')
        }
      } else {
        e = e.set('day', 'Wednesday')
      }
    }

    if (thursRange.contains(moment(e.get('start_time')))) {
      if (hidePastEvents && eDay === tDay) {
        if (moment(e.get('start_time')).isAfter(time)) {
          e = e.set('day', 'Thursday')
        }
      } else {
        e = e.set('day', 'Thursday')
      }
    }
    if (friRange.contains(moment(e.get('start_time')))) {
      if (hidePastEvents && eDay === tDay) {
        if (moment(e.get('start_time')).isAfter(time)) {
          e = e.set('day', 'Friday')
        }
      } else {
        e = e.set('day', 'Friday')
      }
    }
    if (satRange.contains(moment(e.get('start_time')))) {
      if (hidePastEvents && eDay === tDay) {
        if (moment(e.get('start_time')).isAfter(time)) {
          e = e.set('day', 'Saturday')
        }
      } else {
        e = e.set('day', 'Saturday')
      }
    }
    if (sunRange.contains(moment(e.get('start_time')))) {
      if (hidePastEvents && eDay === tDay) {
        if (moment(e.get('start_time')).isAfter(time)) {
          e = e.set('day', 'Sunday')
        }
      } else {
        e = e.set('day', 'Sunday')
      }
    }

    e = e.set('start_time_str', moment(e.get('start_time')).format('h:mma'))
    e = e.set('end_time_str', moment(e.get('end_time')).format('h:mma'))
    return p.set(e.get('day'), p.get(e.get('day'), List()).push(e))
  }, Map.of(
      'Wednesday', List(),
      'Thursday', List(),
      'Friday', List(),
      'Saturday', List(),
      'Sunday', List()
    )
  )

  return Map.of(
    'Wednesday', byDate.get('Wednesday').sort((a, b) => compareDates(a, b)),
    'Thursday', byDate.get('Thursday').sort((a, b) => compareDates(a, b)),
    'Friday', byDate.get('Friday').sort((a, b) => compareDates(a, b)),
    'Saturday', byDate.get('Saturday').sort((a, b) => compareDates(a, b)),
    'Sunday', byDate.get('Sunday').sort((a, b) => compareDates(a, b))
  )
}

export let allVenues = {
  "Basque Center": true,
  "Boise All-ages Movement Project": true,
  "Boise Contemporary Theater": true,
  "Crowbar": true,
  "Egyptian Theatre": true,
  "El Korah Shrine": true,
  "Fatty's": true,
  "Hannah's": true,
  "JUMP (Inspire Studio)": true,
  "JUMP (Celebration Circle)": true,
  "Knitting Factory (Main Room)": true,
  "Knitting Factory (Upstairs)": true,
  "Linen Building": true,
  "Main Stage": true,
  "Mardi Gras": true,
  "Neurolux": true,
  "Pengilly's Saloon": true,
  "Spacebar": true,
  "The District": true,
  "The Nest": true,
  "The Olympic": true,
  "The Reef": true,
  "The Shredder": true,
  "Tom Grainey's": true
}

export let noVenues = {
  "Basque Center": false,
  "Boise All-ages Movement Project": false,
  "Boise Contemporary Theater": false,
  "Crowbar": false,
  "Egyptian Theatre": false,
  "El Korah Shrine": false,
  "Fatty's": false,
  "Hannah's": false,
  "JUMP (Inspire Studio)": false,
  "JUMP (Celebration Circle)": false,
  "Knitting Factory (Main Room)": false,
  "Knitting Factory (Upstairs)": false,
  "Linen Building": false,
  "Main Stage": false,
  "Mardi Gras": false,
  "Neurolux": false,
  "Pengilly's Saloon": false,
  "Spacebar": false,
  "The District": false,
  "The Nest": false,
  "The Olympic": false,
  "The Reef": false,
  "The Shredder": false,
  "Tom Grainey's": false
}

export let allAgesVenues = {
  "Basque Center": true,
  "Boise All-ages Movement Project": true,
  "Boise Contemporary Theater": true,
  "Crowbar": false,
  "Egyptian Theatre": true,
  "El Korah Shrine": true,
  "Fatty's": false,
  "Hannah's": false,
  "JUMP (Inspire Studio)": true,
  "JUMP (Celebration Circle)": true,
  "Knitting Factory (Main Room)": true,
  "Knitting Factory (Upstairs)": true,
  "Linen Building": true,
  "Main Stage": true,
  "Mardi Gras": true,
  "Neurolux": false,
  "Pengilly's Saloon": false,
  "Spacebar": false,
  "The District": true,
  "The Nest": true,
  "The Olympic": false,
  "The Reef": false,
  "The Shredder": false,
  "Tom Grainey's": false
}

export let bars = {
  "Basque Center": false,
  "Boise All-ages Movement Project": false,
  "Boise Contemporary Theater": false,
  "Crowbar": true,
  "Egyptian Theatre": false,
  "El Korah Shrine": false,
  "Fatty's": true,
  "Hannah's": true,
  "JUMP (Inspire Studio)": false,
  "JUMP (Celebration Circle)": false,
  "Knitting Factory (Main Room)": false,
  "Knitting Factory (Upstairs)": false,
  "Linen Building": false,
  "Main Stage": false,
  "Mardi Gras": false,
  "Neurolux": true,
  "Pengilly's Saloon": true,
  "Spacebar": true,
  "The District": false,
  "The Nest": false,
  "The Olympic": true,
  "The Reef": true,
  "The Shredder": true,
  "Tom Grainey's": true
}

export let forts = {
  'Treefort': true,
  'Alefort': false,
  'Comedyfort': false,
  'Filmfort': false,
  'Foodfort': false,
  'Hackfort': false,
  'Kidfort': false,
  'Skatefort': false,
  'Storyfort': false,
  'Yogafort': false,
  'Performanceart': false
}
