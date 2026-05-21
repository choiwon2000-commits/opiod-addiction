import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.documentTypeListItem('post').title('Posts'),
      S.documentTypeListItem('category').title('Categories'),
      S.documentTypeListItem('author').title('Authors'),
      S.divider(),
      S.documentTypeListItem('book').title('Books'),
      S.documentTypeListItem('page').title('Pages'),
      S.documentTypeListItem('illustration').title('Illustrations'),
      S.documentTypeListItem('readingProgress').title('Reading Progress'),
      S.documentTypeListItem('annotation').title('Annotations'),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) =>
          item.getId() &&
          !['post', 'category', 'author', 'book', 'page', 'illustration', 'readingProgress', 'annotation'].includes(
            item.getId()!,
          ),
      ),
    ])
