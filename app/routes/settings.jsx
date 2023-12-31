import {
  Button,
  Flex,
  Input,
  InputBase,
  NumberInput,
  Paper,
  Select,
  Stack,
  Switch,
  Text,
  Title,
  Tooltip,
} from "@mantine/core"
import { useFetcher, useLoaderData, useOutletContext } from "@remix-run/react"
import { IMaskInput } from "react-imask"
import "../styles/styles.css"
import currency from "currency.js"
import { createSupabaseServerClient } from "../util/supabase.server"

export const meta = () => {
  return [{ title: "Settings | WealthFire" }]
}

export const moneyFormatter = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
  minimumFractionDigits: 0,
})

export const action = async ({ request }) => {
  const data = await request.formData()
  const supabase = createSupabaseServerClient({ request })

  const { data: user, error: userError } = await supabase.auth.getUser()
  if (userError) {
    console.log(userError)
    return null
  }

  const { data: oldProfile } = await supabase.from("profiles").select().single()

  const id = user.user.id
  const name = data.get("name") || oldProfile.name || null
  const email = data.get("email") || oldProfile.email || null
  const employmentIncome =
    currency(data.get("employmentIncome")).value ||
    oldProfile.employmentIncome ||
    null
  const currencyValue =
    data.get("currency") || oldProfile.currencyValue || "AUD"
  const netIncome =
    currency(data.get("netIncome")).value || oldProfile.netIncome || 0
  const salaryFrequency =
    data.get("salaryFrequency") || oldProfile.salaryFrequency || "Monthly"
  const cashGoal =
    currency(data.get("cashGoal")).value || oldProfile.cashGoal || null
  const emergencyFundGoal =
    currency(data.get("emergencyFundGoal")).value ||
    oldProfile.emergencyFundGoal ||
    null
  const homeDeposit = data.get("homeDeposit") || oldProfile.homeDeposit || false
  const depositAmount =
    currency(data.get("depositAmount")).value ||
    oldProfile.depositAmount ||
    null

  const { data: profile, error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: id,
        name: name,
        email: email,
        employmentIncome: employmentIncome,
        currency: currencyValue,
        netIncome: netIncome,
        salaryFrequency: salaryFrequency,
        cashGoal: cashGoal,
        emergencyFundGoal: emergencyFundGoal,
        homeDeposit: homeDeposit,
        depositAmount: depositAmount,
      },
      { onConflict: "id" }
    )
    .select()
  if (error) {
    console.log("error ", error)
    return null
  }
  return profile
}

export default function Settings() {
  const fetcher = useFetcher()
  const data = useOutletContext()
  const auth = data.auth
  const profile = data.user

  return (
    <>
      <Stack align="center" mb="50px">
        <Title>Settings</Title>
        <Text>Change Base Settings Here</Text>
      </Stack>
      <fetcher.Form method="POST">
        <Flex gap={"lg"} wrap={"wrap"} justify={"center"}>
          <Paper shadow="xl" p="md" miw={300} w="32%">
            <Stack>
              <Title align="center">General</Title>
              <Flex gap={"md"} align={"center"}>
                <Input.Wrapper
                  w={"65%"}
                  label="Employement Income"
                  description="Your pre-tax yearly income from your job."
                  error=""
                >
                  <InputBase
                    mt={3}
                    component={IMaskInput}
                    mask="$num"
                    blocks={{
                      num: {
                        mask: Number,
                        thousandsSeparator: ",",
                      },
                    }}
                    name="employmentIncome"
                    placeholder={currency(profile?.employmentIncome).format()}
                  />
                </Input.Wrapper>
                <Tooltip label="Other Currency Coming Soon">
                  <Select
                    w={"30%"}
                    disabled
                    label="Currency"
                    value="AUD"
                    data={["AUD", "USD", "NZD", "EUR"]}
                    defaultValue={profile?.currency || "AUD"}
                    name="currency"
                    allowDeselect={false}
                    mt="17px"
                  />
                </Tooltip>
              </Flex>
              <Input.Wrapper
                label="Net Regular Income"
                description="Your post-tax income (how much you get each pay in your account)"
                error=""
              >
                <InputBase
                  name="netIncome"
                  mt={3}
                  component={IMaskInput}
                  mask="$num"
                  blocks={{
                    num: {
                      mask: Number,
                      radix: ".",
                      thousandsSeparator: ",",
                    },
                  }}
                  placeholder={currency(profile?.netIncome).format()}
                />
              </Input.Wrapper>
              <Select
                name="salaryFrequency"
                label="Salary Frequency"
                description="How often you get paid"
                data={["Monthly", "Fortnightly (2-Weeks)", "Weekly"]}
                defaultValue={profile?.salaryFrequency || "Monthly"}
                allowDeselect={false}
              />
            </Stack>
          </Paper>
          <Paper shadow="xl" p="md" miw={300} w="32%">
            <Stack>
              <Title align="center">Targets</Title>
              <Input.Wrapper
                label="Cash Goal"
                description="Set a Cash Goal to work towards"
                error=""
              >
                <InputBase
                  name="cashGoal"
                  mt={3}
                  component={IMaskInput}
                  mask="$num"
                  blocks={{
                    num: {
                      mask: Number,
                      thousandsSeparator: ",",
                    },
                  }}
                  placeholder={currency(profile?.cashGoal).format()}
                />
              </Input.Wrapper>
              <NumberInput
                name="emergencyFundGoal"
                label="Emergency Fund Goal"
                description="How many months you want to save for. We recommend 12 months"
                placeholder={(profile?.emergencyFundGoal || "X") + " Months"}
                allowNegative={false}
                allowDecimal={false}
                suffix=" Months"
              />
              <Switch
                defaultChecked={profile?.homeDeposit || false}
                name="homeDeposit"
                labelPosition="left"
                label="Home Deposit"
                description="Are you saving for a home deposit?"
                className="switch"
                mt="15px"
              />
              <Input.Wrapper
                description="How much are you saving for a home deposit?"
                error=""
              >
                <Input
                  name="depositAmount"
                  placeholder={currency(profile?.depositAmount).format()}
                />
              </Input.Wrapper>
            </Stack>
          </Paper>
          <Paper shadow="xl" p="md" miw={300} w="32%">
            <Stack>
              <Title align="center">Profile</Title>
              <Input.Wrapper
                label="Account"
                description="Used to login to this application"
                error=""
              >
                <Input disabled value={auth?.user?.email} />
              </Input.Wrapper>
              <Input.Wrapper
                label="Email Delivery"
                description="The address we will send emails from inside this app to. This can be different from your account username"
                error=""
              >
                <Input
                  name="email"
                  placeholder={profile?.email || auth?.user?.email}
                />
              </Input.Wrapper>
              <Input.Wrapper
                label="Name"
                description="Your name for use in this app, it can be anything you like"
                error=""
              >
                <Input
                  name="name"
                  placeholder={profile?.name || "John Smith"}
                />
              </Input.Wrapper>
            </Stack>
          </Paper>
        </Flex>
        <Flex mt="50px" justify="center">
          <Button type="submit">Save Changes</Button>
        </Flex>
      </fetcher.Form>
    </>
  )
}
