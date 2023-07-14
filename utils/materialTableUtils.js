const localization = {
  pagination: {
    firstTooltip: 'Primera pagina',
    previousTooltip: 'Anterior',
    nextTooltip: 'Siguiente',
    lastTooltip: 'Ultima pagina',
    labelRowsSelect: 'Registros',
    labelDisplayedRows: '{from}-{to} de {count}',
  },
  toolbar: {
    searchPlaceholder: 'Busqueda',
  },
  header: {
    actions: 'Opciones',
  },
  grouping: {
    groupedBy: 'Agrupado por:',
    placeholder: 'Arrastre aquí la columna para agruparla',
  },
  body: {
    emptyDataSourceMessage: 'Sin datos de busqueda',
    filterRow: {
      filterTooltip: 'Filtro',
    },
  },
};

const options = {
  filtering: false,
  grouping: false,
  exportButton: true,
  actionsColumnIndex: -1,
  pageSize: 50,
  emptyRowsWhenPaging: false,
  padding: 'dense',
  // headerStyle: { backgroundColor: '#253053', color: 'white' },
  pageSizeOptions: [5, 10, 20, 50, 100],

  rowStyle: {
    overflowWrap: 'break-word',
  },
};

module.exports = {
  localization,
  options,
};
