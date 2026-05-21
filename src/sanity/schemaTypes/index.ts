import { type SchemaTypeDefinition } from 'sanity'

import {blockContentType} from './blockContentType'
import {categoryType} from './categoryType'
import {postType} from './postType'
import {authorType} from './authorType'
import {bookType} from './bookType'
import {illustrationType} from './illustrationType'
import {pageType} from './pageType'
import {readingProgressType} from './readingProgressType'
import {annotationType} from './annotationType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContentType,
    categoryType,
    postType,
    authorType,
    bookType,
    illustrationType,
    pageType,
    readingProgressType,
    annotationType,
  ],
}
