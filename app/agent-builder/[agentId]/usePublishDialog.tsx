import React, { useState } from "react";
import PublishCodeDialog from "./preview/_components/PublishCodeDialog";

export function usePublishDialog() {
  const [openPublishDialog, setOpenPublishDialog] = useState(false);
  const openDialog = () => setOpenPublishDialog(true);
  const closeDialog = () => setOpenPublishDialog(false);

  const dialog = (
    <PublishCodeDialog openDialog={openPublishDialog} setOpenDialog={setOpenPublishDialog} />
  );

  return { openDialog, closeDialog, dialog };
}
