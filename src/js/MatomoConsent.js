function createButton (textContent, id, type) {
  var button = document.createElement('button')
  button.setAttribute('type', 'button')
  button.setAttribute('data-dp-consent', id)
  button.textContent = textContent
  button.classList.add('dp-consent-button')
  var buttonStyle = type === 'primary' ? 'dp-consent-button--primary' : 'dp-consent-button--secondary'
  button.classList.add(buttonStyle)
  return button
}

function createConsentSliderButtons () {
  var buttons = document.createElement('div')
  buttons.classList.add('dp-consent-slider__buttons')
  buttons.appendChild(createButton('Alle akzeptieren', 'accept_all', 'primary'))
  buttons.appendChild(createButton('Einstellungen ändern', 'change_settings'))
  return buttons
}

function createCookieItem (cookie) {
  var container = document.createElement('div')
  container.classList.add('dp-consent-modal__cookie-item')

  var name = document.createElement('div')
  name.appendChild(document.createTextNode(cookie.name))

  var explanation = document.createElement('div')
  explanation.appendChild(document.createTextNode(cookie.explanation))

  container.appendChild(name)
  container.appendChild(explanation)
  return container
}

function createNecessaryCookies (cookies) {
  var container = document.createElement('div')
  container.classList.add('dp-consent-modal__content')

  // left side column
  var icon = document.createElement('div')
  icon.classList.add('dp-consent-modal__column--left')
  icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M17.28 9.28a.75.75 0 00-1.06-1.06l-5.97 5.97-2.47-2.47a.75.75 0 00-1.06 1.06l3 3a.75.75 0 001.06 0l6.5-6.5z"></path><path fill-rule="evenodd" d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zM2.5 12a9.5 9.5 0 1119 0 9.5 9.5 0 01-19 0z"></path></svg>'
  container.appendChild(icon)

  // right side column
  var cookieContainer = document.createElement('div')
  cookieContainer.classList.add('dp-consent-modal__column--right')
  var label = document.createElement('span')
  label.classList.add('dp-consent-modal__heading')
  label.appendChild(document.createTextNode('für den Betrieb notwendige Cookies'))
  cookieContainer.appendChild(label)

  cookies.forEach(function (cookie) {
    var explanation = createCookieItem(cookie)
    cookieContainer.appendChild(explanation)
  })

  container.appendChild(icon)
  container.appendChild(cookieContainer)
  return container
}

function createNotice (notice) {
  var noticeContainer = document.createElement('div')
  noticeContainer.appendChild(document.createTextNode(notice))
  return noticeContainer
}

function createOptionalCookies (cookies, consent) {
  var container = document.createElement('div')
  container.classList.add('dp-consent-modal__content')

  // left side column
  var containerLeft = document.createElement('div')
  var checkbox = document.createElement('input')
  checkbox.setAttribute('type', 'checkbox')
  if (consent === true) {
    checkbox.setAttribute('checked', 'true')
  }
  checkbox.setAttribute('id', 'dp-consent-optional')
  checkbox.setAttribute('data-dp-consent', 'dp_consent_optional')
  containerLeft.appendChild(checkbox)

  // right side column
  var cookieContainer = document.createElement('div')
  cookieContainer.classList.add('dp-consent-modal__column--right')
  var label = document.createElement('label')
  label.setAttribute('for', 'dp-consent-optional')
  label.classList.add('dp-consent-modal__heading')
  label.appendChild(document.createTextNode('optionale Cookies'))
  cookieContainer.appendChild(label)

  cookies.forEach(function (cookie) {
    var explanation = createCookieItem(cookie)
    cookieContainer.appendChild(explanation)
  })

  container.appendChild(containerLeft)
  container.appendChild(cookieContainer)
  return container
}

function removeDpConsentElements () {
  var ccNodes = document.querySelectorAll('[data-dp-consent]')
  Array.prototype.forEach.call( ccNodes, function( node ) {
    node.parentNode.removeChild( node )
  })
}





function dpConsent (config) {
  var body = document.getElementsByTagName('body')[0]
  var notice = config.notice
  var optionalCookies = config.optionalCookies
  var necessaryCookies = config.necessaryCookies
  var onGrantConsent = config.onGrantConsent
  var onRevokeConsent = config.onRevokeConsent

  var trackingConsent = {
    _given: false,
    set given (status) {
      if (status === true) {
        onGrantConsent()
        document.cookie = 'dp-cookie-consent=true; max-age=31536000;samesite=lax; path=/'
        this._given = status
      }
      if (status === false) {
        onRevokeConsent()
        document.cookie = 'dp-cookie-consent=false; max-age=31536000; samesite=lax; path=/'
        this._given = status
      }
    },
    get given () {
      return this._given
    }
  }

  function addConsentSlider () {
    var consentSlider = document.createElement('div')
    consentSlider.setAttribute('id', '_cookie-consent')
    consentSlider.setAttribute('data-nosnippet', '')
    consentSlider.setAttribute('role', 'alert')
    consentSlider.setAttribute('tabindex', '0')
    consentSlider.setAttribute('data-dp-consent', 'consentSlider')
    consentSlider.classList.add('dp-consent-slider')
    consentSlider.appendChild(createNotice(notice))
    var buttonRow = createConsentSliderButtons()
    consentSlider.appendChild(buttonRow)
    body.appendChild(consentSlider)
    setTimeout(function () {
      consentSlider.classList.add('dp-consent-slider--visible')
      consentSlider.focus()
    }, 1000)
    consentSlider.addEventListener('click', handleClick)
  }

  function showConsentSlider () {
    var cookies = document.cookie
    var hasCookie = cookies.match(/dp-cookie-consent=([^;]*)/)

    if(!hasCookie) {
      addConsentSlider()
    }
    if (hasCookie) {
      trackingConsent.given = JSON.parse(hasCookie[1])
    }
  }

  function handleClick (e) {
    var targetId = e.target.getAttribute('data-dp-consent')
    if (targetId === 'accept_all') {
      trackingConsent.given = true
      removeDpConsentElements()
    }
    if (targetId === 'change_settings') {
      showSettingsModal()
    }
    if (targetId === 'save_settings') {
      var optionalCheckbox = document.querySelector('[data-dp-consent="dp_consent_optional"]')
      var status = optionalCheckbox.checked
      trackingConsent.given = status
      removeDpConsentElements()
    }
  }

  function showSettingsModal () {
    var modal = document.createElement('div')
    var buttonContainer = document.createElement('div')
    var backdrop = document.createElement('div')
    var headline = document.createElement('h2')
    headline.textContent = 'Verwendete Cookies'
    backdrop.setAttribute('data-dp-consent', 'modalContainer')
    backdrop.classList.add('dp-consent-modal__backdrop')
    buttonContainer.classList.add('dp-consent-modal__button')
    buttonContainer.appendChild(createButton('Einstellungen speichern', 'save_settings', 'primary'))
    modal.classList.add('dp-consent-modal')
    modal.setAttribute('role', 'alert')
    modal.appendChild(headline)
    modal.appendChild(createNecessaryCookies(necessaryCookies, trackingConsent.given))
    modal.appendChild(createOptionalCookies(optionalCookies, trackingConsent.given))
    modal.appendChild(buttonContainer)
    modal.addEventListener('click', handleClick)
    backdrop.appendChild(modal)
    body.appendChild(backdrop)
  }

  showConsentSlider()

  return {
    adjustSettings: showSettingsModal
  }
}


export { dpConsent }


