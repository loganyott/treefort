import React from 'react'
import { Row } from './Cards'

export const TreefortLineup = ({partitionedList, events}) => {
  return (
    <div>
      {partitionedList.valueSeq().map((i, j) => <Row items={i} key={j} events={events} />)}
    </div>
  )
}

export const YogafortLineup = ({perfs, events}) => {
  const yogaArtists = perfs['typeA']
  const yogaInstructors = perfs['typeB']
  return (
    <div>
      <div className='type-a splitlineup clearfix'>
        <h2 className='center'>Music Provided By</h2>
        {yogaArtists.valueSeq().map((i, j) => <Row items={i} key={j} events={events} />)}
      </div>
      <div className='type-b splitlineup clearfix'>
        <h2 className='center'>Yogafort Instructors</h2>
        {yogaInstructors.valueSeq().map((i, j) => <Row items={i} key={j} events={events} />)}
      </div>
    </div>
  )
}

export const FilmfortLineup = ({perfs, events}) => {
  const features = perfs['typeA']
  const shorts = perfs['typeB']
  const specials = perfs['typeC']
  return (
    <div>
      <div className='type-a splitlineup clearfix'>
        <h2 className='center'>Features</h2>
        {features.valueSeq().map((i, j) => <Row items={i} key={j} events={events} />)}
      </div>
      <div className='type-b splitlineup clearfix'>
        <h2 className='center'>Shorts</h2>
        {shorts.valueSeq().map((i, j) => <Row items={i} key={j} events={events} />)}
      </div>
      <div className='type-b splitlineup clearfix'>
        <h2 className='center'>Special Events</h2>
        {specials.valueSeq().map((i, j) => <Row items={i} key={j} events={events} />)}
      </div>
    </div>
  )
}

export const FoodfortLineup = ({perfs, events}) => {
  const talks = perfs['typeA']
  const tastes = perfs['typeB']
  return (
    <div>
      { perfs['typeA'].size > 0
        ? (
        <div className='type-a splitlineup clearfix'>
          <h2 className='center'>Talks</h2>
          {talks.valueSeq().map((i, j) => <Row items={i} key={j} events={events} />)}
        </div>
        ) : <div />
      }

      { perfs['typeB'].size > 0
        ? (
          <div className='type-b splitlineup clearfix'>
            <h2 className='center'>Tastes</h2>
            {tastes.valueSeq().map((i, j) => <Row items={i} key={j} events={events} />)}
          </div>
        ) : <div />
      }
    </div>
  )
}

export const HackfortLineup = ({perfs, events}) => {
  const hacks = perfs['typeA']
  const bios = perfs['typeB']
  return (
    <div>
      { perfs['typeA'].size > 0
        ? (
        <div className='type-a splitlineup clearfix'>
          <h2 className='center'>Events</h2>
          {hacks.valueSeq().map((i, j) => <Row items={i} key={j} events={events} />)}
        </div>
        ) : <div />
      }

      { perfs['typeB'].size > 0
        ? (
          <div className='type-b splitlineup clearfix'>
            <h2 className='center'>Bios</h2>
            {bios.valueSeq().map((i, j) => <Row items={i} key={j} events={events} />)}
          </div>
        ) : <div />
      }
    </div>
  )
}