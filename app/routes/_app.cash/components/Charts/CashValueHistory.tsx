import { Paper, Stack, Title } from "@mantine/core"
import useHistory from "~/utils/hooks/useHistory"
import { BarChart } from "@mantine/charts"

const CashValueHistory = () => {
  const { history } = useHistory()
  return (
    <Paper shadow="md" p={10} withBorder>
      <Stack>
        <Title>Cash Value History</Title>
        <BarChart
          h={300}
          data={history}
          dataKey="date"
          series={[{ name: "cash", color: "violet.6" }]}
          tickLine="x"
        />
      </Stack>
    </Paper>
  )
}

export default CashValueHistory