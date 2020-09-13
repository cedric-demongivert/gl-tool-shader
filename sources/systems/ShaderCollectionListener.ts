import { ShaderIdentifier } from '../ShaderIdentifier'

import { ShaderCollection } from './ShaderCollection'

export interface ShaderCollectionListener {
  /**
  * Called when this listener is attached to a collection.
  *
  * @param collection - The new parent collection of this listener.
  */
  afterSubscription (collection : ShaderCollection) : void

  /**
  * Called when the given shader was created into the parent collection.
  *
  * @param identifier - Identifier of the shader that was created.
  */
  afterShaderCreation (identifier : ShaderIdentifier) : void

  /**
  * Called when the parent collection did update the source of a given shader.
  *
  * @param identifier - Identifier of the shader that was updated.
  */
  afterSourceUpdate (identifier : ShaderIdentifier) : void

  /**
  * Called when the given shader will be deleted from the parent collection.
  *
  * @param identifier - Identifier of the shader that will be deleted.
  */
  beforeShaderDeletion (identifier : ShaderIdentifier) : void

  /**
  * Called when this driver is detached from collection.
  *
  * @param system - The old collection of this listener.
  */
  beforeUnsubscription (collection : ShaderCollection) : void
}
