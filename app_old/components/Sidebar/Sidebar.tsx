import { Badge, Box, Button, Group, Text, Title } from "@mantine/core"
import BankAccounts from "../AccountComponent/BankAccounts"
import classes from "./Sidebar.module.css"
import { useFetcher } from "@remix-run/react"
import { FaPlus } from "react-icons/fa/index.js"
import { formatter } from "~/utils/utils"

//TODO: Have it slide out on load
const Sidebar = ({
  title,
  totalBalance,
  data,
  type = "income",
}: {
  title: string
  totalBalance: number
  data: any[]
  type: "income" | "debt"
}) => {
  const fetcher = useFetcher()

  return (
    <Box className={`${classes.sidebar} ${false && classes.collapsed}`}>
      <Title className={classes.header} size={"h2"}>
        {title}
      </Title>
      <Group gap={0} className={classes.badge}>
        <Text fw={700}>
          {type === "income" ? "Total Balance:" : "Total Owing:"}
        </Text>
        <Badge size="xl" variant="light" radius="sm">
          <Text fw={700}>{formatter("AUD", totalBalance)}</Text>
        </Badge>
      </Group>
      <BankAccounts totalBalance={totalBalance} data={data} type={type} />
      <fetcher.Form method="POST">
        <Button
          type="submit"
          name="intent"
          value="createData"
          size="xs"
          variant="subtle"
          color="gray"
          leftSection={<FaPlus />}
        >
          Add Account
        </Button>
      </fetcher.Form>
    </Box>
  )
}

export default Sidebar
