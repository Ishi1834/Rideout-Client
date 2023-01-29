import { useState } from "react"
// UI
import { Button, Dialog } from "react-native-paper"
import { RadioInput } from "./RadioInput"
// Other
import axios from "../axiosConfig"
import { reportTypes } from "../static/multiSelectOptions"

export const ReportContentDialog = ({
  reportDialogVisible,
  hideReportDialog,
}) => {
  const [selectedReason, setSelectedReason] = useState(null)
  const [isMakingApiRequest, setIsMakingApiRequest] = useState(false)

  const submitReport = async () => {
    setIsMakingApiRequest(true)
    /* try {
      const res = await axios.post("/report", {
        selectedReason,
      })
      console.log(res)
    } catch (error) {
      console.log("error", error)
    } */
    setIsMakingApiRequest(false)
  }

  return (
    <Dialog visible={reportDialogVisible} onDismiss={hideReportDialog}>
      <Dialog.Title>Why are you reporting this?</Dialog.Title>
      <Dialog.Content>
        <RadioInput
          radioLabel="Select an option"
          radioData={reportTypes}
          itemSelected={(val) => setSelectedReason(val)}
          disabled={isMakingApiRequest && true}
        />
      </Dialog.Content>
      <Dialog.Actions>
        <Button
          onPress={hideReportDialog}
          loading={isMakingApiRequest && true}
          disabled={isMakingApiRequest && true}
        >
          Cancel
        </Button>
        <Button
          onPress={submitReport}
          loading={isMakingApiRequest && true}
          disabled={isMakingApiRequest && true}
        >
          Submit
        </Button>
      </Dialog.Actions>
    </Dialog>
  )
}
