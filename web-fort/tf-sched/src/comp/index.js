import React from 'react'
import { List } from 'immutable'
import Moment from 'moment'
import { extendMoment } from 'moment-range'

const moment = extendMoment(Moment)


export const Days = ({dayHandler, selected}) => {
  const selClasses = 'b yellow'

  return (
    <div className='f2 ttu ph3 pv2 mh3 mv2 pointer'>
      <span className={`${selected === 'Wednesday' ? `${selClasses}` : ''} mr3 pl3 pointer day date22`} onClick={() => dayHandler('Wednesday')}>
        Wednesday
      </span><span className='no-print'> | </span>
      <span className={`${selected === 'Thursday' ? `${selClasses}` : ''} mr3 pl3 pointer day date23`} onClick={() => dayHandler('Thursday')}>
        Thursday
      </span><span className='no-print'> | </span>
      <span className={`${selected === 'Friday' ? `${selClasses}` : ''} mr3 pl3 pointer day date24`} onClick={() => dayHandler('Friday')}>
        Friday
      </span><span className='no-print'> | </span>
      <span className={`${selected === 'Saturday' ? `${selClasses}` : ''} mr3 pl3 pointer day date25`} onClick={() => dayHandler('Saturday')}>
        Saturday
      </span><span className='no-print'> | </span>
      <span className={`${selected === 'Sunday' ? `${selClasses}` : ''} mr3 pl3 pointer day date26`} onClick={() => dayHandler('Sunday')}>
        Sunday
      </span>
    </div>
  )
}

export const FortFilter = ({fortHandler, selected}) => {
  const selClasses = 'b orange'

  return (
    <div className='f2 ttu ph3 pv2 mh3 mv2 pointer'>
      <span className={`${selected['Treefort'] ? `${selClasses}` : ''} mr3 pl3 pointer day`} onClick={() => fortHandler('Treefort')}>
        Treefort
      </span><span className='no-print'> | </span>
      <span className={`${selected['Alefort'] ? `${selClasses}` : ''} mr3 pl3 pointer day`} onClick={() => fortHandler('Alefort')}>
        Alefort
      </span><span className='no-print'> | </span>
      <span className={`${selected['Comedyfort'] ? `${selClasses}` : ''} mr3 pl3 pointer day`} onClick={() => fortHandler('Comedyfort')}>
        Comedyfort
      </span><span className='no-print'> | </span>
      <span className={`${selected['Filmfort'] ? `${selClasses}` : ''} mr3 pl3 pointer day`} onClick={() => fortHandler('Filmfort')}>
        Filmfort
      </span><span className='no-print'> | </span>
      <span className={`${selected['Foodfort'] ? `${selClasses}` : ''} mr3 pl3 pointer day`} onClick={() => fortHandler('Foodfort')}>
        Foodfort
      </span><span className='no-print'> | </span>
      <span className={`${selected['Hackfort'] ? `${selClasses}` : ''} mr3 pl3 pointer day`} onClick={() => fortHandler('Hackfort')}>
        Hackfort
      </span><span className='no-print'> | </span>
      <span className={`${selected['Kidfort'] ? `${selClasses}` : ''} mr3 pl3 pointer day`} onClick={() => fortHandler('Kidfort')}>
        Kidfort
      </span><span className='no-print'> | </span>
      <span className={`${selected['Performanceart'] ? `${selClasses}` : ''} mr3 pl3 pointer day`} onClick={() => fortHandler('Performanceart')}>
        Performanceart
      </span><span className='no-print'> | </span>
      <span className={`${selected['Skatefort'] ? `${selClasses}` : ''} mr3 pl3 pointer day`} onClick={() => fortHandler('Skatefort')}>
        Skatefort
      </span><span className='no-print'> | </span>
      <span className={`${selected['Storyfort'] ? `${selClasses}` : ''} mr3 pl3 pointer day`} onClick={() => fortHandler('Storyfort')}>
        Storyfort
      </span><span className='no-print'> | </span>
      <span className={`${selected['Yogafort'] ? `${selClasses}` : ''} mr3 pl3 pointer day`} onClick={() => fortHandler('Yogafort')}>
        Yogafort
      </span>
    </div>
  )
}

export const FilterInput = React.createClass({
  propTypes: {
    handleInput: React.PropTypes.func
  },

  getInitialState () {
    return { searchTerm: '' }
  },

  render () {
    const handleInput = this.props.handleInput
    return (
      <div className='container no-print'>
        <div className='input-group'>
          <span className='input-group-addon' id='filter-label'>Search</span>
          <input className='form-control' placeholder='Begin typing to filter results' type='text' aria-describedby='filter-label' onChange={(e) => handleInput(e)} />
        </div>
      </div>
    )
  }

})

export const Venues = ({venueHandler, venues}) => {
  return (
    <div className='no-print'>
      <div className='clearfix'>
        <span onClick={() => venueHandler('all', venues)} className='mh3 ba f4 ttu link dim br3 ph3 pv2 mh3 mv2 dib pointer ' style={{background: '#868686', color: '#1b2253', borderColor: '#ccc'}}>Select All</span>
        <span onClick={() => venueHandler('none', venues)} className='mh3 ba f4 ttu link dim br3 ph3 pv2 mh3 mv2 dib pointer ' style={{background: '#868686', color: '#1b2253', borderColor: '#ccc'}}>Select None</span>
        <span onClick={() => venueHandler('allAges', venues)} className='mh3 ba f4 ttu link dim br3 ph3 pv2 mh3 mv2 dib pointer pink'>All Ages</span>
        <span onClick={() => venueHandler('21', venues)} className='mh3 ba f4 ttu link dim br3 ph3 pv2 mh3 mv2 dib pointer pink'>21+ Only</span>
      </div>
      <div className='clearfix'>
        {Object.keys(venues).sort().map((v, i) => {
          return (
            <span
              className={`ba f4 ttu link dim br3 ph3 pv2 mh3 mv2 dib pointer ${venues[v] ? 'bg-yellow' : ''}`}
              style={{borderColor: 'yellow'}}
              onClick={() => venueHandler(v, venues)}
              key={i}
            >
              {v}
            </span>
          )
        })
        }
      </div>
    </div>
  )
}

const SchedEntry = ({start, end, name, venue, search, fort, link, cancelled, day}) => {
  return (
    <div className={`${fort} flex sched-item mv4 mh3 items-center`}>
      <div className='flex flex-column items-center tracked time'>
        <div className='mh3 f4 lh-title fort-text print'>
          { fort !== 'Treefort'
            ? fort
            : null
          }
        </div>
        <span className='mh3 f2 ttu start'>
          {start}
        </span>
        <span className='mh3 f4 lh-title'>
          to {end}
        </span>
        <div className='mh3 f4 lh-title fort-text no-print'>
          { fort !== 'Treefort'
            ? fort
            : null
          }
        </div>
      </div>

      <div className='flex flex-column pv3 event'>
        <span className='tf-san-serif mr3 f1 fw7 lh-title tracked'>
          <a className='artist-link' href={`lineup/#${link}`} target='_blank'>
            {cancelled ? <span className='red'><span className='strike'>{name}</span> CANCELLED</span> : name }
          </a>
        </span>
      </div>
      <div className='f1 fw4 lh-title tracked venue'>
        <div className='venue-text tf-san-serif'>
          <span>{venue.get('name')}</span>
          <p className='ml2'>{day ? day : null}</p>
        </div>
      </div>
    </div>
  )
}

export const Schedule = ({events, venueFilter, searchTerm, fortFilter, custom}) => {
  if (custom) {
    return (
      <div>
        {events.map((e,i) => {
          const realDay = moment(e.get('start_time')).format('dddd')

          const dispDay = e.get('day') === realDay ? e.get('day') : `${e.get('day')} Night / ${realDay} Morning`
          return (
            <SchedEntry
              start={e.get('start_time_str')}
              end={e.get('end_time_str')}
              name={e.get('name')}
              venue={e.get('venue')}
              fort={e.get('forts').get(0)}
              link={e.get('performers').get(0).get('id')}
              cancelled={e.get('cancelled')}
              day={dispDay}
              key={i}
            />
          )
        })}
      </div>
    )
  }

  return (
    <div>
      {events.map((e, i) => { 
        const realDay = moment(e.get('start_time')).format('dddd')

        const dispDay = e.get('day') === realDay ? e.get('day') : `${e.get('day')} Night / ${realDay} Morning`

        const performers = e.get('performers').map(p => p.get('name').toLowerCase())
                            .join(' ')

        if (fortFilter && fortFilter['Treefort'] && e.get('forts', List()).includes('Treefort')) {
          if (venueFilter[e.getIn(['venue', 'name'])]) {
            if (!!searchTerm && searchTerm.length > 0) {
              if (e.get('name').toLowerCase().includes(searchTerm.toLowerCase()) ||
                  performers.indexOf(searchTerm.toLowerCase()) !== -1 ) {
                return (
                  <SchedEntry
                    start={e.get('start_time_str')}
                    end={e.get('end_time_str')}
                    name={e.get('name')}
                    venue={e.get('venue')}
                    fort={e.get('forts').get(0)}
                    link={e.get('performers').get(0).get('id')}
                    cancelled={e.get('cancelled')}
                    day={dispDay}
                    key={i}
                  />
                )
              }
              return
            }
            return (
              <SchedEntry
                start={e.get('start_time_str')}
                end={e.get('end_time_str')}
                name={e.get('name')}
                venue={e.get('venue')}
                fort={e.get('forts').get(0)}
                link={e.get('performers').get(0).get('id')}
                cancelled={e.get('cancelled')}
                day={dispDay}
                key={i}
              />
            )
          }

          return
        }

        if (fortFilter && (fortFilter[e.get('forts').get(0)] || fortFilter[e.get('forts').get(1)])) {
          if (searchTerm && searchTerm.length > 0) {
            if (e.get('name').toLowerCase().includes(searchTerm.toLowerCase()) ||
                performers.indexOf(searchTerm.toLowerCase()) !== -1 ) {
              return (
                <SchedEntry
                  start={e.get('start_time_str')}
                  end={e.get('end_time_str')}
                  name={e.get('name')}
                  venue={e.get('venue')}
                  fort={e.get('forts').get(0)}
                  link={e.get('performers').get(0).get('id')}
                  cancelled={e.get('cancelled')}
                  day={dispDay}
                  key={i}
                />
              )
            }
          }

          if (e.get('name').toLowerCase().includes(searchTerm.toLowerCase()) ||
              performers.indexOf(searchTerm.toLowerCase()) !== -1 ) {
            return (
              <SchedEntry
                start={e.get('start_time_str')}
                end={e.get('end_time_str')}
                name={e.get('name')}
                venue={e.get('venue')}
                fort={e.get('forts').get(0)}
                link={e.get('performers').get(0).get('id')}
                cancelled={e.get('cancelled')}
                day={dispDay}
                key={i}
              />
            )
          }
        }
      })
      }
    </div>
  )
}
