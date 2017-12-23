import React from 'react'
import Modal from 'react-modal'
import DetailModal from './DetailModal.jsx'

/**
 * Social icons
 */
import facebook from '../../../assets/social/Facebook.png'
import facebookp from '../../../assets/social/Facebookp.png'
import link from '../../../assets/social/webLink.png'
import linkp from '../../../assets/social/webLinkp.png'
import musicLink from '../../../assets/social/artistLink.png'
import musicLinkp from '../../../assets/social/artistLinkp.png'
import youtube from '../../../assets/social/Youtube.png'
import youtubep from '../../../assets/social/Youtubep.png'
import instagram from '../../../assets/social/Instagram.png'
import instagramp from '../../../assets/social/Instagramp.png'
import twitter from '../../../assets/social/twitter.png'
import twitterp from '../../../assets/social/twitterp.png'

/**
 * Background textures
 */
//import bgimg from '../../../assets/doodles/artistpattern.png'
//import modalbgimg from '../../../assets/doodles/artistpattern.png'
import cardPlaceholderImage from '../../../assets/images/targetInvert-250x300.png'

/**
 * Modal close button
 */
import modalclose from '../../../assets/close.png'

/**
 * Social Links
 */
export const SocialLinks = ({item}) => {
  const centerStyles = { // NOT CURRENTLY WORKING
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto'
  }

  const imgStyles = {
    width: '50px'
  }

  return (
    <div>
      {!!item.get('video_url') // eslint-disable-line no-extra-boolean-cast
        ? (<a className='triggeryt' href={item.get('video_url')} target='_blank'><img className='iconyt' src={youtube}  style={imgStyles} role='presentation' /><img className='iconytp' src={youtubep}  style={imgStyles} role='presentation' /></a>)
        : null
      }
      {!!item.get('facebook_url') // eslint-disable-line no-extra-boolean-cast
        ? (<a className='triggerfb' href={item.get('facebook_url')} target='_blank'><img className='iconfb' src={facebook} style={imgStyles} role='presentation' /><img className='iconfbp' src={facebookp} style={imgStyles} role='presentation' /></a>)
        : null
      }
      {!!item.get('instagram_url') // eslint-disable-line no-extra-boolean-cast
        ? (<a className='triggerig' href={item.get('instagram_url')} target='_blank'><img className='iconig' src={instagram} style={imgStyles} role='presentation' /><img className='iconigp' src={instagramp} style={imgStyles} role='presentation' /></a>)
        : null
      }
      {!!item.get('twitter_url') // eslint-disable-line no-extra-boolean-cast
        ? (<a className='triggertw' href={item.get('twitter_url')} target='_blank'><img className='icontw' src={twitter} style={imgStyles} role='presentation' /><img className='icontwp' src={twitterp} style={imgStyles} role='presentation' /></a>)
        : null
      }
      {!!item.get('music_url') // eslint-disable-line no-extra-boolean-cast
        ? (<a className='triggerml' href={item.get('music_url')} target='_blank'><img className='iconml' src={musicLink} style={imgStyles} role='presentation' /><img className='iconmlp' src={musicLinkp} style={imgStyles} role='presentation' /></a>)
        : null
      }
      {!!item.get('website_url') // eslint-disable-line no-extra-boolean-cast
        ? (<a className='triggerwl' href={item.get('website_url')} target='_blank'><img className='iconwl' src={link} style={imgStyles} role='presentation' /><img className='iconwlp' src={linkp} style={imgStyles} role='presentation' /></a>)
        : null
      }
    </div>
  )
}

/**
 * The card container
 */
export const PerformerCard = React.createClass({
  propTypes: {
    item: React.PropTypes.object,
    event: React.PropTypes.object
  },

  componentWillMount: function () {
    this.setState({ open: false })
  },

  openModal: function () {
    this.setState({ open: true })
    // Add a hash to the artist for a direct link
    window.location.hash = this.props.item.get('id')
  },

  closeModal: function () {
    this.setState({ open: false })
    // Remove the url hash
    history.replaceState({}, document.title, '.')
  },

  render: function () {
    const { item, event } = this.props

    const cardStyles = {
      minHeight: '425px',
      margin: '30px 20px',
      backgroundSize: '180%'
    }

    const imgDivStyles = {
      height: '317px',
      maxWidth: '417px',
      position: 'relative',
      overflow: 'hidden',
      margin: 'auto',
      cursor: 'pointer',
    }

    const imgStyles = {
      minHeight: '100%',
      objectFit: 'cover'
    }

    const h3styles = {
      margin: '0 auto',
      width: '100%',
      padding: '5px 0',
      textAlign: 'center',
      fontWeight: '700',
      color: 'rgba(252,215,56,1)',
      fontFamily: 'Weston'
    }

    const modalStyles = {
      overlay: {
        background: 'rgba(1,1,1,0.75)'
      },
      content: {
        background: `#000`,
        border: 'none'
      }
    }

    return (
      <div className="col-xs-12 col-md-4">
        <div style={cardStyles}>
          <div className="performerImage" style={imgDivStyles} onClick={this.openModal}>
            {/* Render image  */}
            <img style={imgStyles} src={`${item.get('image_url_med') ? item.get('image_url_med') : cardPlaceholderImage}`}
              alt={item.get('name')}
              className='img-responsive center'
              role='presentation'
              />
          </div>
          {/* Render name  */}
          <div style={{ marginTop: '40px', width: '100%' }}>
            <h3 style={h3styles} className="hidden-xs">
              {item.get('name')}
            </h3>
            <h4 style={h3styles} className="visible-xs">
              {item.get('name')}
            </h4>
            <p style={{ margin: '0 0 30px 0', textTransform: 'uppercase'}} className='white tc'>{item.get('home_town')}</p>
          </div>

          {/* Render modal content */}
          <Modal isOpen={this.state.open} onRequestClose={this.closeModal} style={modalStyles}>
            <img style={{ cursor: 'pointer' }} src={modalclose} onClick={this.closeModal} role='presentation'/>
            <DetailModal item={item} event={event}/>
          </Modal>
        </div>
      </div>
    )
  }
})

/**
 * Iterates the items in the rows passed to it
 */
export const Row = React.createClass({
  propTypes: {
    items: React.PropTypes.object,
    events: React.PropTypes.object,
    searchTerm: React.PropTypes.object
  },

  handleInput (e) {
    this.setState({ searchTerm: e.target.value })
  },

  render () {
    const { items, events } = this.props

    return (
      <div>
        <div className='col-xs-12'>
        </div>
        <div className='col-xs-12'>
          {items.map((i, j) => <PerformerCard item={i} key={j}
            event={events.filter(e => {
                    return e.get('performers')
                   })
                   .find(p => {
                    p.get('id') === i.get('id')
                   })
                  }
            />
          )}
        </div>
      </div>
    )
  }
})
