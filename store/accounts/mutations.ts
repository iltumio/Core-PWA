import { UserRegistrationData } from '~/types/ui/user'
import { RootState } from '../store.types'
import { RegistrationStatus } from './types'

const mutations = {
  setPin(state: RootState, pin: string) {
    state.accounts.pin = pin
  },
  setPinHash(state: RootState, pinHash: string) {
    state.accounts.pinHash = pinHash
  },
  unlock(state: RootState, pin: string) {
    state.accounts.locked = false
    state.accounts.pin = pin
  },
  setEncryptedPhrase(state: RootState, encryptedPhrase: string) {
    state.accounts.encryptedPhrase = encryptedPhrase
  },
  setPhrase(state: RootState, decryptedPhrase: string) {
    state.accounts.phrase = decryptedPhrase
  },
  setActiveAccount(state: RootState, activeAccountPubkey: string) {
    state.accounts.active = activeAccountPubkey
  },
  setUserDetails(state: RootState, details: UserRegistrationData) {
    state.accounts.details = { 
      name: details.username,
      status: details.status,
      profilePicture: details.imageURI,
      address: state.accounts.active,
      state: 'online',
    }
  },
  setRegistrationStatus(
    state: RootState,
    registrationStates: RegistrationStatus
  ) {
    state.accounts.registrationStatus = registrationStates
  },
}

export default mutations
