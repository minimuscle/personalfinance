import { Paper, Stack, Table, Title } from "@mantine/core"
import useHistory from "~/utils/hooks/useHistory"
import { formatter } from "~/utils/utils"
import styles from "../cash.module.css"

const CashHistory = () => {
  const { history } = useHistory()

  return (
    <Paper className={styles.totals} shadow="md" p={10} withBorder>
      <Stack>
        <Title>Cash History</Title>
        <Table.ScrollContainer className={styles.totalsTable} minWidth="100%">
          <Table
            verticalSpacing="md"
            stickyHeader
            withTableBorder
            highlightOnHover
            striped
          >
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Date</Table.Th>
                <Table.Th>Total Cash</Table.Th>
                <Table.Th>Cash Gain</Table.Th>
                <Table.Th>Savings Rate</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {history.map((item, key) => {
                const date = new Date(item.date).toLocaleString("en-AU", {
                  month: "short",
                  year: "numeric",
                })
                const gain = item.cash - history[key - 1]?.cash
                const gainPercentage =
                  key > 0
                    ? ((gain / history[key - 1]?.cash) * 100).toFixed(0)
                    : 0
                const savingsRate =
                  key > 0
                    ? ((gain / history[key - 1]?.income) * 100).toFixed(0)
                    : 0
                return (
                  <Table.Tr key={key}>
                    <Table.Td>{date}</Table.Td>
                    <Table.Td>{formatter("AUD", item.cash)}</Table.Td>
                    <Table.Td>
                      {key > 0
                        ? `${formatter("AUD", gain)} ( 
                  ${gain > 0 ? "+" + gainPercentage : gainPercentage}
                  % )`
                        : "-"}
                    </Table.Td>
                    <Table.Td>{savingsRate}%</Table.Td>
                  </Table.Tr>
                )
              })}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Stack>
    </Paper>
  )
}

export default CashHistory
