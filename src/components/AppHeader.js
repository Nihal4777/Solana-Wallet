import React, { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  useColorModes,
  CFormSelect,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CModalTitle,
  CButton,
  CTooltip,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilContrast,
  cilEnvelopeOpen,
  cilList,
  cilMenu,
  cilCopy,
  cilMoon,
  cilSun,
  cilAccountLogout
} from '@coreui/icons'

import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'
import { changeAccount } from '../store/accountSlice'
const AppHeader = () => {
  const headerRef = useRef()
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')

  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.changeState.sidebarShow)
  const accounts = useSelector((state) => state.account.accounts)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    console.log(accounts)
    // setSelected(accounts[0].address)
    document.addEventListener('scroll', () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
    })
  }, [])
  const [selected, setSelected] = useState(''); // default selected
  useEffect(() => {
    if (accounts.length > 0 && !selected) {
      const firstAccount = accounts[0].address
      setSelected(firstAccount)
      dispatch(changeAccount(firstAccount))
    }
  }, [accounts, selected, dispatch])
  const handleChange = (e) => {
    const value = e.target.value;
      dispatch(changeAccount(value))
      setSelected(value);
      console.log('Selected account:', value);
  };
  const CopyButton = ({text}) => {
    const [tooltipText, setTooltipText] = useState('Copy to clipboard')

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(text)
        setTooltipText('Copied!')
        setTimeout(() => setTooltipText('Copy to clipboard'), 2000)
      } catch (err) {
        console.error('Failed to copy:', err)
      }
    }
    return (
      <CTooltip content={tooltipText} className='my-2'>
        <CButton className="ms-2" onClick={handleCopy}
        ><CIcon icon={cilCopy} size="md" />
        </CButton>
      </CTooltip>
    )
  }
  return (
    <>
      <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
        <CContainer className="border-bottom px-4" fluid>
          <CHeaderToggler
            onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
            style={{ marginInlineStart: '-14px' }}
          >
            <CIcon icon={cilMenu} size="lg" />
          </CHeaderToggler>
          <CHeaderNav>
            <CFormSelect id="solanaAccounts" size="lg" className="my-1" aria-label="Large select example" value={selected} onChange={handleChange}>
              {accounts.map((account, index) => (
                <option key={index} value={account.address}>
                  {`A/C ${index + 1}: ${account.address}`}
                </option>
              ))}
            </CFormSelect>
            <CopyButton text={selected} />
          </CHeaderNav>
          <CHeaderNav>
            <li className="nav-item py-1">
              <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
            </li>

            {/* Theme Change */}
            <CDropdown variant="nav-item" placement="bottom-end">
              <CDropdownToggle caret={false}>
                {colorMode === 'dark' ? (
                  <CIcon icon={cilMoon} size="lg" />
                ) : colorMode === 'auto' ? (
                  <CIcon icon={cilContrast} size="lg" />
                ) : (
                  <CIcon icon={cilSun} size="lg" />
                )}
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem
                  active={colorMode === 'light'}
                  className="d-flex align-items-center"
                  as="button"
                  type="button"
                  onClick={() => setColorMode('light')}
                >
                  <CIcon className="me-2" icon={cilSun} size="lg" /> Light
                </CDropdownItem>
                <CDropdownItem
                  active={colorMode === 'dark'}
                  className="d-flex align-items-center"
                  as="button"
                  type="button"
                  onClick={() => setColorMode('dark')}
                >
                  <CIcon className="me-2" icon={cilMoon} size="lg" /> Dark
                </CDropdownItem>
                <CDropdownItem
                  active={colorMode === 'auto'}
                  className="d-flex align-items-center"
                  as="button"
                  type="button"
                  onClick={() => setColorMode('auto')}
                >
                  <CIcon className="me-2" icon={cilContrast} size="lg" /> Auto
                </CDropdownItem>
              </CDropdownMenu>
            </CDropdown>

            {/* <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li> */}
            {/* <AppHeaderDropdown /> */}
            <CButton
              className="ms-2"
              onClick={() => {
                sessionStorage.removeItem("auth_token");
                window.location.href = "/login";
              }}
            >
              <CIcon icon={cilAccountLogout} size="md" />
            </CButton>
          </CHeaderNav>
        </CContainer>
        <CContainer className="px-4" fluid>
          <AppBreadcrumb />
        </CContainer>
      </CHeader>
      <CModal
        backdrop="static"
        visible={visible}
        onClose={() => setVisible(false)}
        aria-labelledby="StaticBackdropExampleLabel"
      >
        <CModalHeader>
          <CModalTitle id="StaticBackdropExampleLabel">Add a new solana account</CModalTitle>
        </CModalHeader>
        <CModalBody>
          I will not close if you click outside me. Don't even try to press escape key.
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Close
          </CButton>
          <CButton color="primary">Save changes</CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default AppHeader
