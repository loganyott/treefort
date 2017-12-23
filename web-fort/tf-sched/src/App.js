import React from 'react'
import './App.css'
import './sched.css'
import '../../style.css'
import { fromJS, List, Map } from 'immutable'
import axios from 'axios'
import { Circle } from 'better-react-spinkit'
import Moment from 'moment'
import { extendMoment } from 'moment-range'
import { allVenues, noVenues, allAgesVenues,
          bars, preprocess, forts, festGoingOn } from './utils'
import { Days, Schedule, Venues, FilterInput, FortFilter } from './comp'

require('tachyons')

const moment = extendMoment(Moment)

const lookForHash = (w, h) => {
  // split on `&` to break hash into parts
  return w.indexOf('&') !== -1
      ? w.split('&').filter(f => f.indexOf(h) !== -1)[0].split(h)[1]
      : w.split(h)[1]
}

const App = React.createClass({
  componentWillMount: function () {
    // Set the current time to 2 hours ago for handling recently started events
    let time = moment().subtract(2, 'hours')
    let day = 'Wednesday'
    let hidePastEvents = false

    // Time Test (Thursday)
    // time = moment([2017, 2, 23]).add(19, 'hours')

    const w = !!window.location.hash ? window.location.hash.slice(1) : ''

    const f = w.indexOf('fort=') !== -1 ? lookForHash(w, 'fort=') : ''
    const d = w.indexOf('day=') !== -1 ? lookForHash(w, 'day=') : ''
    const s = w.indexOf('schedule=') !== -1 ? lookForHash(w, 'schedule=') : ''

    let fFilter = f ? Object.assign(forts, 
                        {'Treefort': f.indexOf('Treefort') !== -1},
                        {'Alefort': f.indexOf('Alefort') !== -1},
                        {'Comedyfort': f.indexOf('Comedyfort') !== -1},
                        {'Filmfort': f.indexOf('Filmfort') !== -1},
                        {'Foodfort': f.indexOf('Foodfort') !== -1},
                        {'Hackfort': f.indexOf('Hackfort') !== -1},
                        {'Kidfort': f.indexOf('Kidfort') !== -1},
                        {'Performanceart': f.indexOf('Performanceart') !== -1},
                        {'Skatefort': f.indexOf('Skatefort') !== -1},
                        {'Storyfort': f.indexOf('Storyfort') !== -1},
                        {'Yogafort': f.indexOf('Yogafort') !== -1},
                      ) : forts

    if (festGoingOn(time)) {
      day = moment().day(time.weekday()).format('dddd')
      hidePastEvents = true
    }

    // Providing a shared schedule link should always show all events
    if (!!s) {
      hidePastEvents = false
    } 

    this.setState({
      events: List(),
      day: !!d ? d : day,
      time: time,
      venueFilter: allVenues,
      searchTerm: '',
      hidePastEvents: hidePastEvents,
      fortFilter: !!f ? fFilter : forts,
      sharedSchedId: s
    })
  },

  componentDidMount: function () {
    this.setState({isFetching: true})
    this.fetchData()
  },

  fetchData: function () {
    // use dev endpoints on localhost and staging, prod for everything else
    let devOrProd = 'prod'

    const apiUrl = 'https://7n74ikdn58.execute-api.us-west-2.amazonaws.com/' + devOrProd + '/v1/events'

    const { time, hidePastEvents, sharedSchedId } = this.state
    axios
      .get(apiUrl)
      .then((result) => {
        const events = fromJS(result.data)
        debugger;
        this.setState({events: preprocess(events, time, hidePastEvents), isFetching: false})
      })

    if (!!sharedSchedId) {
      axios
        .get('https://7n74ikdn58.execute-api.us-west-2.amazonaws.com/' +
              devOrProd +
              '/v1/schedules/' +
              sharedSchedId
         )
        .then((result) => {
          const events = fromJS(result.data)
          this.setState({sharedSched: events.get('events'), isFetching: false})
        })
    }
  },

  handleDays: function (e) {
    this.setState({day: e})
  },

  handleForts: function (e) {
    let forts = this.state.fortFilter
    forts[e] = !forts[e]
    this.setState({forts: forts})
  },

  handleInput: function (e) {
    const searchTerm = e.target.value
    this.setState({searchTerm: searchTerm})
  },

  handleVenues: function (v, venues) {
    if (v === 'all') {
      venues = allVenues
    } else if (v === 'none') {
      venues = noVenues
    } else if (v === 'allAges') {
      venues = allAgesVenues
    } else if (v === '21') {
      venues = bars
    } else {
      venues[v] = !venues[v]
    }

    this.setState({venueFilter: venues})
  },

  render: function () {
    let { events, day, searchTerm, venueFilter, fortFilter, sharedSched } = this.state

    const eventsByDay = {
      Wednesday: events.get('Wednesday', Map()),
      Thursday: events.get('Thursday', Map()),
      Friday: events.get('Friday', Map()),
      Saturday: events.get('Saturday', Map()),
      Sunday: events.get('Sunday', Map())
    }

    const allEvents = events.get('Wednesday', List())
    .concat(events.get('Thursday', List()))
    .concat(events.get('Friday', List()))
    .concat(events.get('Saturday', List()))
    .concat(events.get('Sunday'), List())

    let sharedSchedEvents = List()

    if (sharedSched && sharedSched.size > 0 && allEvents && allEvents.size > 0) {
      sharedSchedEvents = allEvents.filter(i => i ? sharedSched.includes(i.get('id')) : null)
    }

    const customEvents = sharedSchedEvents.size > 0 ? sharedSchedEvents : allEvents

    return (
      <div className='clearfix'>
        { events.size > 0 && (sharedSchedEvents.size === 0)
          ? (
              <div className='row-fluid'>
                <div className='mb4'>
                  <Days dayHandler={this.handleDays} selected={day} />
                </div>
                <div className='mb4'>
                  <FortFilter fortHandler={this.handleForts} selected={fortFilter} />
                </div>
                <div className='mb4'>
                  <FilterInput handleInput={this.handleInput} />
                </div>
                <div className='mb4'>
                  { this.state.fortFilter['Treefort']
                    ? <Venues venueHandler={this.handleVenues} venues={venueFilter} />
                    : null
                  }
                </div>
                <Schedule
                  events={searchTerm === '' ? eventsByDay[day] : allEvents}
                  venueFilter={venueFilter}
                  searchTerm={searchTerm}
                  fortFilter={fortFilter}
                />
              </div>
              )
          :
            events.size > 0 && sharedSched && sharedSched.size > 0
              ? (<Schedule events={customEvents} custom />)
              : (<div className='flex align-center'><Circle color='white' size={50} /></div>)
        }
      </div>
    )
  }

})

export default App

