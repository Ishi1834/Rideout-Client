import { useEffect, useState } from "react"
import { DataTable, IconButton, MD3Colors } from "react-native-paper"

const numberOfItemsPerPageList = [2, 3, 4, 5, 6, 7, 8, 9, 10]

export const ListMembers = ({ members, isEditMembers }) => {
  const [page, setPage] = useState(0)
  const [numberOfItemsPerPage, onItemsPerPageChange] = useState(
    numberOfItemsPerPageList[0]
  )
  const from = page * numberOfItemsPerPage
  const to = Math.min((page + 1) * numberOfItemsPerPage, members.length)

  useEffect(() => {
    setPage(0)
  }, [numberOfItemsPerPage])

  return (
    <DataTable>
      <DataTable.Header>
        <DataTable.Title>Member</DataTable.Title>
        <DataTable.Title>Permission</DataTable.Title>
        {isEditMembers && <DataTable.Title>Edit</DataTable.Title>}
        {isEditMembers && <DataTable.Title>Remove</DataTable.Title>}
      </DataTable.Header>

      {members.map((member, index) => {
        if (index >= from && index < to) {
          return (
            <DataTable.Row key={index}>
              <DataTable.Cell>{member.name}</DataTable.Cell>
              <DataTable.Cell>{member.authorization}</DataTable.Cell>
              {isEditMembers && (
                <DataTable.Cell>
                  <IconButton
                    icon="account-edit-outline"
                    iconColor={MD3Colors.error20}
                    size={20}
                    onPress={() => console.log("Pressed")}
                  />
                </DataTable.Cell>
              )}
              {isEditMembers && (
                <DataTable.Cell>
                  <IconButton
                    icon="account-remove-outline"
                    iconColor={MD3Colors.error50}
                    size={20}
                    onPress={() => console.log("Pressed")}
                  />
                </DataTable.Cell>
              )}
            </DataTable.Row>
          )
        }
      })}

      <DataTable.Pagination
        page={page}
        numberOfPages={Math.ceil(members.length / numberOfItemsPerPage)}
        onPageChange={(page) => setPage(page)}
        label={`${from + 1}-${to} of ${members.length}`}
        showFastPaginationControls
        numberOfItemsPerPageList={numberOfItemsPerPageList}
        numberOfItemsPerPage={numberOfItemsPerPage}
        onItemsPerPageChange={onItemsPerPageChange}
        selectPageDropdownLabel={"Rows per page"}
      />
    </DataTable>
  )
}
