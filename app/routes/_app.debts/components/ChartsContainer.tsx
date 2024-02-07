import useHistory from "~/utils/hooks/useHistory"
import SuperValueHistory from "./Charts/SuperValueHistory"
import SavingsHistory from "./Charts/SavingsHistory"
import { useMemo, useState } from "react"
import { transformData } from "~/utils/utils"
import { Stack } from "@mantine/core"
import classes from "../debts.module.css"

const ChartsContainer = () => {
  const { history } = useHistory()
  const [active, setActive] = useState("ALL")
  const historyData = useMemo(
    () => transformData(history, active),
    [history, active]
  )
  return (
    <Stack className={classes.charts}>
      <SuperValueHistory
        data={historyData}
        active={active}
        setActive={setActive}
      />
      <SavingsHistory
        data={historyData}
        active={active}
        setActive={setActive}
      />
    </Stack>
  )
}

export default ChartsContainer
