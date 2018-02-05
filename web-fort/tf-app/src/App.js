import React from 'react'
import './App.css'
import '../../style.css'
import { fromJS, List, Set} from 'immutable'
import axios from 'axios'
import Modal from 'react-modal'
import DetailModal from './comp/DetailModal.jsx'
import modalbgimg from '../../assets/doodles/artistpattern.png'
import { Circle } from 'better-react-spinkit'
import FilterInput from './comp/FilterInput'
import modalclose from '../../assets/close.png'
import fortMap from './utils/fortMap'
import { partitionList, getPerformers, splitLineup } from './utils'
import { TreefortLineup, YogafortLineup, FilmfortLineup, FoodfortLineup, HackfortLineup } from './comp/Forts'

const CARDS_PER_ROW = 3
const modalStyles = {
  overlay: {
    background: 'rgba(1,1,1,0.75)'
  },
  content: {
    background: `#000`,
    border: 'none'
  }
}

const App = React.createClass({
  propTypes: {
    fort: React.PropTypes.string
  },

  componentWillMount: function () {
    this.setState({performers: List(), partitionedList: List(), searchTerm: '', events: List()})
  },

  componentDidMount: function () {
    let fort = this.props.fort === null ? 'Treefort' : fortMap[this.props.fort]
 
    /**
     * UNCOMMENT FOR MANUAL FORT OVERRIDE
     */
     //fort = 'Hackfort' 

    this.setState({isFetching: true, fort: fort})
    this.fetchData(fort)
  },

  handleInput (e) {
    const searchTerm = e.target.value
    const perfList = getPerformers(this.state.performers, searchTerm, this.state.fort)
    const partitionedList = partitionList(perfList, CARDS_PER_ROW)
    this.setState({perfList: perfList, partitionedList: partitionedList, searchTerm: searchTerm})
  },

  fetchData: function (fort) {
    // use dev endpoints on localhost and staging, prod for everything else
    let devOrProd = 'prod'

    // Keep it prod for now
    if (location.hostname === 'localhost' ||
        location.hostname === 'treefortfest.staging.wpengine.com') {
      devOrProd = 'dev'
    }

    const apiUrl = 'https://api.tmf.zone/' + devOrProd + '/v1/performers'

    // TODO: events will be part of the performers object soon, coordinate with #api-fort team members
    const eventsUrl = 'https://api.tmf.zone/' + devOrProd + '/v1/events'

    axios
      .get(apiUrl)
      .then((result) => {
        const performers = fromJS(result.data.body)
        // debugger;
        // let genres = Set()
        // performers.map(p => p.get('genres', []).map(g => genres = genres.add(g)))
        this.setState({performers: performers, isFetching: false})
      })
    axios.get(eventsUrl)
      .then((result) => {
        const events = fromJS(result.data.body)
        this.setState({events: events})
      })
  },

  closeModal: function () {
    // Remove the performer id from the url, then refresh the page.
    history.replaceState({}, document.title, '.')
    location.reload()
  },

  render: function () {
    const { performers, searchTerm, fort, events } = this.state
    const perfList = getPerformers(performers, searchTerm, fort)
    const partitionedList = partitionList(perfList, CARDS_PER_ROW)

    const fortDisplayMap = {
      'Treefort': <TreefortLineup partitionedList={partitionedList} events={events} />,
      'Comedyfort': <TreefortLineup partitionedList={partitionedList} events={events} />,
      'Alefort': <TreefortLineup partitionedList={partitionedList} events={events} />,
      'Kidfort': <TreefortLineup partitionedList={partitionedList} events={events} />,
      'Skatefort': <TreefortLineup partitionedList={partitionedList} events={events} />,
      'Storyfort': <TreefortLineup partitionedList={partitionedList} events={events} />,
      'Performanceart': <TreefortLineup partitionedList={partitionedList} events={events} />,
      'Yogafort': <YogafortLineup perfs={splitLineup(perfList, 'YogafortArtist', 'YogafortTeacher', 'null', CARDS_PER_ROW)} events={events} />,
      'Filmfort': <FilmfortLineup perfs={splitLineup(perfList, 'Filmfortfeature', 'Filmfortshort', 'Filmfortspecial', CARDS_PER_ROW)} events={events} />,
      'Foodfort': <FoodfortLineup perfs={splitLineup(perfList, 'Foodforttalks', 'Foodforttastes', 'null', CARDS_PER_ROW)} events={events} />,
      'Hackfort': <HackfortLineup perfs={splitLineup(perfList, 'HackfortEvent', 'HackfortSpeaker', 'null', CARDS_PER_ROW)} events={events} />
    }

    // If a hash has been provided directly, render the detailed content.
    if (window.location.hash && performers.size > 0) {
      const pid = window.location.hash.slice(1)

      // Find the right item
      const item = performers.find((e) => e.get('id') === pid)
      const event = events.filter(e => e.get('performers').find(p => p.get('id') === pid))

      // Hash doesn't match a valid id, reload the page
      if (!item) {
        this.closeModal()
      }

      return (
        <Modal isOpen onRequestClose={this.closeModal} style={modalStyles}>
          <img style={{ cursor: 'pointer' }} src={modalclose} onClick={this.closeModal} role='presentation' />
          <DetailModal item={item} event={event} />
        </Modal>
      )
    }

    return (
      <div className='row-fluid'>
        { perfList.size > 0 || searchTerm.length > 0
          ? (
            <div>
              <FilterInput handleInput={this.handleInput} />
              {fortDisplayMap[fort]}
            </div>
            )
          : (
            <div className='flex justify-center items-center'>
              <Circle color='white' size={50} />
            </div>
            )
        }
      </div>
    )
  }
})

export default App
