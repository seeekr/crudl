import { Joi } from './base'

import listView from './listView'
import changeView from './changeView'
import addView from './addView'

const views = Joi.object().pattern(/.+/,
    Joi.object().keys({
        listView: listView.required(),
        changeView: changeView.required(),
        addView,
    })
)

export default views
