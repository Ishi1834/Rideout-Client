import { useEffect, useState } from "react"
import { StyleSheet } from "react-native"
import { Button, DataTable, IconButton, MD3Colors } from "react-native-paper"

const numberOfItemsPerPageList = [2, 3, 4, 5, 6]

export const ListMembers = ({
  members,
  isEditMembers,
  joinRequests,
  handleAction,
}) => {
  const [showJoinRequets, setShowJoinRequets] = useState(false)
  const [page, setPage] = useState(0)
  const [numberOfItemsPerPage, onItemsPerPageChange] = useState(
    numberOfItemsPerPageList[0]
  )
  const from = page * numberOfItemsPerPage

  useEffect(() => {
    setPage(0)
  }, [numberOfItemsPerPage])

  useEffect(() => {
    if (joinRequests.length === 0) {
      setShowJoinRequets(false)
    }
  }, [joinRequests?.length])

  let usersArray = []
  if (showJoinRequets) {
    usersArray = [...joinRequests]
  } else {
    usersArray = [...members]
  }

  const hasJoinRequests = joinRequests.length !== 0 ? true : false

  const to = Math.min((page + 1) * numberOfItemsPerPage, usersArray.length)

  return (
    <DataTable>
      {isEditMembers && hasJoinRequests && (
        <Button
          mode="contained-tonal"
          style={styles.tableButton}
          onPress={() => setShowJoinRequets(!showJoinRequets)}
        >
          {showJoinRequets ? "View members" : "View Join requests"}
        </Button>
      )}
      <DataTable.Header>
        <DataTable.Title
          style={
            showJoinRequets
              ? styles.tableJoinRequestName
              : styles.tableMemberName
          }
        >
          {showJoinRequets ? "Requests to Join" : "Members"}
        </DataTable.Title>
        {isEditMembers &&
          (showJoinRequets ? (
            <DataTable.Title style={styles.tableJoinRequestAction}>
              Add
            </DataTable.Title>
          ) : (
            <>
              <DataTable.Title style={styles.tableMemberRole}>
                Permission
              </DataTable.Title>
              <DataTable.Title style={styles.tableMemberAction}>
                Edit
              </DataTable.Title>
              <DataTable.Title style={styles.tableMemberAction}>
                Remove
              </DataTable.Title>
            </>
          ))}
      </DataTable.Header>
      {usersArray
        .slice(
          page * numberOfItemsPerPage,
          page * numberOfItemsPerPage + numberOfItemsPerPage
        )
        .map((member, index) => (
          <DataTable.Row key={index}>
            <DataTable.Cell
              style={
                showJoinRequets
                  ? styles.tableJoinRequestName
                  : styles.tableMemberName
              }
            >
              {member.name}
            </DataTable.Cell>

            {isEditMembers &&
              (showJoinRequets ? (
                <DataTable.Cell style={styles.tableJoinRequestAction}>
                  <IconButton
                    icon="account-plus-outline"
                    iconColor={MD3Colors.error20}
                    size={20}
                    onPress={() => handleAction("add", member)}
                  />
                </DataTable.Cell>
              ) : (
                <>
                  <DataTable.Cell style={styles.tableMemberRole}>
                    {member.authorization}
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.tableMemberAction}>
                    <IconButton
                      icon="account-edit-outline"
                      iconColor={MD3Colors.error20}
                      size={20}
                      onPress={() => handleAction("edit", member)}
                    />
                  </DataTable.Cell>

                  <DataTable.Cell style={styles.tableMemberAction}>
                    <IconButton
                      icon="account-remove-outline"
                      iconColor={MD3Colors.error50}
                      size={20}
                      onPress={() => handleAction("remove", member)}
                    />
                  </DataTable.Cell>
                </>
              ))}
          </DataTable.Row>
        ))}

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
