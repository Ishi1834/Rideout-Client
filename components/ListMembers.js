import { useEffect, useState } from "react"
import { StyleSheet } from "react-native"
import { DataTable, IconButton, MD3Colors } from "react-native-paper"

const numberOfItemsPerPageList = [2, 3, 4, 5, 6]

export const ListMembers = ({
  members,
  label = "Member",
  isEditMembers,
  showPermission = false,
  joinRequests,
}) => {
  const [page, setPage] = useState(0)
  const [numberOfItemsPerPage, onItemsPerPageChange] = useState(
    numberOfItemsPerPageList[0]
  )
  const from = page * numberOfItemsPerPage

  useEffect(() => {
    setPage(0)
  }, [numberOfItemsPerPage])

  let usersArray = [...members]
  if (joinRequests.length !== 0) {
    usersArray = [...members, ...joinRequests]
  }

  const to = Math.min((page + 1) * numberOfItemsPerPage, usersArray.length)

  return (
    <DataTable>
      <DataTable.Header>
        <DataTable.Title style={styles.tableName}>{label}</DataTable.Title>
        {showPermission && <DataTable.Title>Permission</DataTable.Title>}
        {isEditMembers && joinRequests.length !== 0 && (
          <DataTable.Title style={styles.tableAction}>Add</DataTable.Title>
        )}
        {isEditMembers && (
          <DataTable.Title style={styles.tableAction}>Edit</DataTable.Title>
        )}
        {isEditMembers && (
          <DataTable.Title style={styles.tableAction}>Remove</DataTable.Title>
        )}
      </DataTable.Header>

      {usersArray.map((member, index) => {
        if (
          usersArray.slice(
            page * numberOfItemsPerPage,
            page * numberOfItemsPerPage + numberOfItemsPerPage
          )
        ) {
          return (
            <DataTable.Row key={index}>
              <DataTable.Cell style={styles.tableName}>
                {member.name}
              </DataTable.Cell>
              {showPermission && (
                <DataTable.Cell>{member.authorization}</DataTable.Cell>
              )}

              {isEditMembers && (
                <>
                  <DataTable.Cell style={styles.tableAction}>
                    {!member?.authorization && (
                      <IconButton
                        icon="account-plus-outline"
                        iconColor={MD3Colors.error20}
                        size={20}
                        onPress={() => console.log("add ", member.userId)}
                      />
                    )}
                  </DataTable.Cell>

                  <DataTable.Cell style={styles.tableAction}>
                    {member?.authorization && (
                      <IconButton
                        icon="account-edit-outline"
                        iconColor={MD3Colors.error20}
                        size={20}
                        onPress={() => console.log("edit ", member.userId)}
                      />
                    )}
                  </DataTable.Cell>

                  <DataTable.Cell style={styles.tableAction}>
                    {member?.authorization && (
                      <IconButton
                        icon="account-remove-outline"
                        iconColor={MD3Colors.error50}
                        size={20}
                        onPress={() => console.log("remove ", member.userId)}
                      />
                    )}
                  </DataTable.Cell>
                </>
              )}
            </DataTable.Row>
          )
        }
      })}

      <DataTable.Pagination
        page={page}
        numberOfPages={Math.ceil(usersArray.length / numberOfItemsPerPage)}
        onPageChange={(page) => setPage(page)}
        label={`${from + 1}-${to} of ${usersArray.length}`}
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
  tableName: {
    flex: 2,
  },
  tableAction: {
    flex: 1,
  },
})
