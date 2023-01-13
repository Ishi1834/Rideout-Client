import { useEffect, useState } from "react"
import { StyleSheet } from "react-native"
import { Button, DataTable, IconButton, MD3Colors } from "react-native-paper"

const numberOfItemsPerPageList = [2, 3, 4, 5, 6]

export const TableList = ({ data }) => {
  const [page, setPage] = useState(0)
  const [numberOfItemsPerPage, onItemsPerPageChange] = useState(
    numberOfItemsPerPageList[0]
  )
  const from = page * numberOfItemsPerPage

  useEffect(() => {
    setPage(0)
  }, [numberOfItemsPerPage])

  /* Example data object
  const data = {
    columnStyle: [],
    headersArray: ["name", "age", "gender"],
    rowsArray: [
      ["ismail", 22, "M"],
      ["ikram", 25, "F"],
      ["maryam", 22, "F"],
    ],
  }
 */

  const { rowsArray, headersArray } = data

  const to = Math.min((page + 1) * numberOfItemsPerPage, rowsArray.length)

  return (
    <DataTable>
      <DataTable.Header>
        {headersArray.map((title, index) => (
          <DataTable.Title key={index}>{title}</DataTable.Title>
        ))}
      </DataTable.Header>

      {rowsArray
        .slice(
          page * numberOfItemsPerPage,
          page * numberOfItemsPerPage + numberOfItemsPerPage
        )
        .map((row, index) => {
          return (
            <DataTable.Row key={index}>
              {Array.isArray(row) ? (
                row.map((item, index) => (
                  <DataTable.Cell key={index}>{item}</DataTable.Cell>
                ))
              ) : (
                <DataTable.Cell key={index}>{row}</DataTable.Cell>
              )}
            </DataTable.Row>
          )
        })}

      <DataTable.Pagination
        page={page}
        numberOfPages={Math.ceil(rowsArray.length / numberOfItemsPerPage)}
        onPageChange={(page) => setPage(page)}
        label={`${from + 1}-${to} of ${rowsArray.length}`}
        showFastPaginationControls
        numberOfItemsPerPageList={numberOfItemsPerPageList}
        numberOfItemsPerPage={numberOfItemsPerPage}
        onItemsPerPageChange={onItemsPerPageChange}
        selectPageDropdownLabel={"Rows per page"}
      />
    </DataTable>
  )
}

const styles = StyleSheet.create({
  tableButton: {
    alignSelf: "flex-end",
    marginTop: 15,
    marginBottom: 10,
  },
  tableMemberName: {
    flex: 2,
  },
  tableMemberRole: {
    flex: 1.5,
    justifyContent: "center",
  },
  tableMemberAction: {
    flex: 1.2,
    justifyContent: "center",
  },
  tableJoinRequestName: {
    flex: 1.5,
  },
  tableJoinRequestAction: {
    flex: 1,
    justifyContent: "center",
  },
})
