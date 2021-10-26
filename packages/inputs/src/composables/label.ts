import { FormKitSchemaNode, FormKitSchemaComposable } from '@formkit/core'
import { extend } from '@formkit/utils'

const label: FormKitSchemaComposable = (schema = {}, children = []) => ({
  if: '$slots.label',
  then: '$slots.label',
  else: [
    extend(
      {
        $el: 'label',
        if: '$label',
        attrs: {
          for: '$id',
          class: '$classes.label',
        },
        children,
      },
      schema
    ) as FormKitSchemaNode,
  ],
})
export default label