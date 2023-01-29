import { useState } from "react"
// UI
import { Button, Dialog, HelperText, Text } from "react-native-paper"
import { RadioInput } from "./RadioInput"
// Other
import axios from "../axiosConfig"
import { reportTypes } from "../static/multiSelectOptions"

export const ReportContentDialog = ({
  reportDialogVisible,
  hideReportDialog,
  content,
}) => {
  const [selectedReason, setSelectedReason] = useState(null)
  const [reasonNotSelectedError, setReasonNotSelectedError] = useState(false)
  const [isMakingApiRequest, setIsMakingApiRequest] = useState(false)
  const [reportSubmitted, setReportSubmitted] = useState(false)

  const submitReport = async () => {
    if (!selectedReason) {
      setReasonNotSelectedError(true)
      return
    }
    setIsMakingApiRequest(true)
    const data = {
      ...content,
      reportedReason: selectedReason,
    }

    try {
      const res = await axios.post("/helpAndSupport/reportContent", data)
      if (res.status === 201) {
        setReportSubmitted(true)
        const { reportId } = res.data
      }
    } catch (error) {
      console.log(error?.response?.data?.message)
    }

    setIsMakingApiRequest(false)
  }

  return (
    <Dialog
      visible={reportDialogVisible}
      onDismiss={() => {
        setSelectedReason(null)
        hideReportDialog()
      }}
    >
      {!reportSubmitted && (
        <Dialog.Title>Why are you reporting this?</Dialog.Title>
      )}
      <Dialog.Content>
        {reportSubmitted ? (
          <Text variant="bodyMedium">Your report has been submitted</Text>
        ) : (
          <>
            <RadioInput
              radioLabel="Select an option"
              radioData={reportTypes}
              itemSelected={(val) => {
                setReasonNotSelectedError(false)
                setSelectedReason(val)
              }}
              disabled={isMakingApiRequest && true}
            />
            <HelperText type="error" visible={reasonNotSelectedError}>
              Please select an option
            </HelperText>
          </>
        )}
      </Dialog.Content>
      <Dialog.Actions>
        <Button
          onPress={() => {
            setSelectedReason(null)
            hideReportDialog()
          }}
          loading={isMakingApiRequest && true}
          disabled={isMakingApiRequest && true}
        >
          {reportSubmitted ? "Ok" : "Cancel"}
        </Button>
        {!reportSubmitted && (
          <Button
            onPress={submitReport}
            loading={isMakingApiRequest && true}
            disabled={isMakingApiRequest && true}
          >
            Submit
          </Button>
        )}
      </Dialog.Actions>
    </Dialog>
  )
}
