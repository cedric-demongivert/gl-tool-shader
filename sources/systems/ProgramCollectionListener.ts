import { ProgramIdentifier } from '../ProgramIdentifier'

import { ProgramCollection } from './ProgramCollection'

export interface ProgramCollectionListener {
  /**
  * Called when this listener is attached to the given program collection.
  *
  * @param collection - The new program collection of this listener.
  */
  afterSubscription (collection : ProgramCollection) : void

  /**
  * Called when the parent collection will delete a program.
  *
  * @param identifier - Identifier of the program that will be deleted.
  */
  beforeProgramDeletion (identifier : ProgramIdentifier) : void

  /**
  * Called when the given program was created.
  *
  * @param identifier - Identifier of the program that was created.
  */
  afterProgramCreation (identifier : ProgramIdentifier) : void

  /**
  * Called after an update of the given program.
  *
  * @param identifier - Identifier of the program that was updated.
  */
  afterProgramUpdate (identifier : ProgramIdentifier) : void

  /**
  * Called when this listener will be detached from the given program collection.
  *
  * @param system - The old parent program collection of this listener.
  */
  beforeUnsubscription (collection : ProgramCollection) : void
}
