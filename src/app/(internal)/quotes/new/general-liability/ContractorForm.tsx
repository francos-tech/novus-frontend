/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  Form,
  Input,
  DatePicker,
  Select,
  InputNumber,
  Card,
  Row,
  Col,
  Divider,
  Typography,
  Checkbox,
} from "antd";
import { Button } from "@/components/ui/button";
import glClassCodesData from "@/constants/glClassCodes.json";

const { Title } = Typography;
const { Option } = Select;

interface QuoteFormData {
  account: {
    Name: string;
    location: Array<{
      Number: string;
      IsPrimaryLocation: string;
      Address1: string;
      ZipCode: string;
    }>;
  };
  policy: {
    EffectiveDate: string;
    ExpirationDate: string;
    line: {
      Type: string;
      Deductible: string;
      PolicyPerOccurenceLimit: string;
      PolicyAggregateLimit: string;
      CoverageForm: string;
      risk: Array<{
        LocationNumber: string;
        GLClassCode: string;
        Exposure: string;
      }>;
      optionalCoverages: {
        WithPrimaryOrNonContributoryWording: string;
        AdditionalInsured: Array<{
          Form: string;
          NumberOfInsureds: string;
          WOS: string;
        }>;
      };
    };
  };
}

export type GeneralLiabilityRef = {
  submit: () => void;
  draft: () => void;
};

export type GeneralLiabilityProps = {
  onSubmit: (payload: QuoteFormData) => void;
  onDraft: (payload: QuoteFormData) => void;
};

const QuotesPage = forwardRef<GeneralLiabilityRef, GeneralLiabilityProps>(
  ({ onSubmit, onDraft }, ref) => {
    const [form] = Form.useForm();
    const [multipleLocations, setMultipleLocations] = useState(false);

    useImperativeHandle(ref, () => ({
      submit: () => {
        form.submit();
      },
      draft: () => {
        const payload: QuoteFormData = parseFormValues(form.getFieldsValue());
        onDraft(payload);
      },
    }), [form, onDraft]);

    const parseFormValues = (values: Record<string, unknown>) => {
      const payload: QuoteFormData = {
        account: {
          Name: values.insuredName as string,
          location: [
            {
              Number: "1",
              IsPrimaryLocation: "1",
              Address1: values.address1 as string,
              ZipCode: values.zipCode as string,
            },
          ],
        },
        policy: {
          EffectiveDate: (values.effectiveDate as any).format("YYYY-MM-DD"),
          ExpirationDate: (values.expirationDate as any).format("YYYY-MM-DD"),
          line: {
            Type: "GeneralLiability",
            Deductible: (values.deductible as number).toString(),
            PolicyPerOccurenceLimit: (
              values.policyPerOccurrenceLimit as number
            ).toString(),
            PolicyAggregateLimit: (
              values.policyAggregateLimit as number
            ).toString(),
            CoverageForm: values.coverageForm as string,
            risk: (values.risks as Array<Record<string, unknown>>).map(
              (risk) => ({
                LocationNumber: "1",
                GLClassCode: risk.glClassCode as string,
                Exposure: (risk.exposure as number).toString(),
              })
            ),
            optionalCoverages: {
              WithPrimaryOrNonContributoryWording:
                (values.withPrimaryOrNonContributoryWording as boolean)
                  ? "1"
                  : "0",
              AdditionalInsured: (
                values.additionalInsured as Array<Record<string, unknown>>
              ).map((insured) => ({
                Form: insured.form as string,
                NumberOfInsureds: (
                  insured.numberOfInsureds as number
                ).toString(),
                WOS: (insured.wos as number).toString(),
              })),
            },
          },
        },
      };

      return payload;
    };

    const onFinish = async (values: Record<string, unknown>) => {
      try {
        const payload: QuoteFormData = parseFormValues(values);
        onSubmit(payload);
      } catch (error: any) {
        console.error("Quote submission error:", error);
      }
    };

    const initialValues = {
      coverageForm: "OCCURRENCE",
      deductible: 0,
      policyPerOccurrenceLimit: 1000000,
      policyAggregateLimit: 2000000,
      withPrimaryOrNonContributoryWording: true,
      risks: [{ glClassCode: "10010", exposure: 15000 }],
      additionalInsured: [{ form: "CG2011", numberOfInsureds: 4, wos: 4 }],
    };

    return (
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={initialValues}
        size="large"
      >
        {/* Account Information */}
        <Title level={4}>Account Information</Title>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Insured Name"
              name="insuredName"
              tooltip="Enter the full legal name of the insured party or business entity"
              rules={[
                { required: true, message: "Please enter the insured name" },
                { min: 2, message: "Name must be at least 2 characters" },
              ]}
            >
              <Input placeholder="Enter insured name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Address"
              name="address1"
              tooltip="Enter the primary business address where the insured operates"
              rules={[{ required: true, message: "Please enter the address" }]}
            >
              <Input placeholder="Enter address" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Zip Code"
              name="zipCode"
              tooltip="Enter the 5-digit ZIP code for the business location"
              rules={[
                { required: true, message: "Please enter zip code" },
                {
                  pattern: /^\d{5}(-\d{4})?$/,
                  message: "Please enter a valid zip code",
                },
              ]}
            >
              <Input placeholder="Enter zip code" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="multipleLocations"
              valuePropName="checked"
              tooltip="Check this box if the business has multiple locations"
            >
              <Checkbox
                onChange={(e) => setMultipleLocations(e.target.checked)}
              >
                Multiple Locations
              </Checkbox>
            </Form.Item>
          </Col>
        </Row>

        {multipleLocations && (
          <Form.List name="locations">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Card
                    key={key}
                    size="small"
                    style={{ marginBottom: 16 }}
                    extra={
                      <Button
                        variant="ghost"
                        className="p-0 h-8 w-8"
                        onClick={() => remove(name)}
                      >
                        <DeleteOutlined className="w-4 h-4 mx-auto text-red-500" />
                      </Button>
                    }
                  >
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          {...restField}
                          name={[name, "address1"]}
                          label="Address"
                          tooltip="Enter the address of the business location"
                          rules={[
                            {
                              required: true,
                              message: "Please enter address",
                            },
                          ]}
                        >
                          <Input placeholder="Enter address" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          {...restField}
                          name={[name, "zipCode"]}
                          label="Zip Code"
                          tooltip="Enter the 5-digit ZIP code for the business location"
                          rules={[
                            {
                              required: true,
                              message: "Please enter zip code",
                            },
                          ]}
                        >
                          <Input placeholder="Enter zip code" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                ))}
                <Form.Item>
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => add()}
                  >
                    <PlusOutlined className="mr-2" />
                    Add Location
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        )}

        <Divider />

        {/* Policy Information */}
        <Title level={4}>Policy Information</Title>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Effective Date"
              name="effectiveDate"
              tooltip="Select the date when the insurance coverage begins"
              rules={[
                { required: true, message: "Please select effective date" },
              ]}
            >
              <DatePicker
                style={{ width: "100%" }}
                placeholder="Select effective date"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Expiration Date"
              name="expirationDate"
              tooltip="Select the date when the insurance coverage ends (typically one year from effective date)"
              rules={[
                { required: true, message: "Please select expiration date" },
              ]}
            >
              <DatePicker
                style={{ width: "100%" }}
                placeholder="Select expiration date"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="Coverage Form"
              name="coverageForm"
              tooltip="Occurrence: Covers claims that occur during the policy period regardless of when reported. Claims Made: Covers claims reported during the policy period"
              rules={[
                { required: true, message: "Please select coverage form" },
              ]}
            >
              <Select placeholder="Select coverage form">
                <Option value="OCCURRENCE">Occurrence</Option>
                <Option value="CLAIMS_MADE">Claims Made</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Deductible"
              name="deductible"
              tooltip="The amount the insured must pay before the insurance coverage kicks in"
              rules={[
                { required: true, message: "Please enter deductible" },
                {
                  type: "number",
                  min: 0,
                  message: "Deductible must be 0 or greater",
                },
              ]}
            >
              <Select
                style={{ width: "100%" }}
                placeholder="Select deductible"
              >
                <Option value={0}>$0</Option>
                <Option value={250}>$250</Option>
                <Option value={500}>$500</Option>
                <Option value={1000}>$1000</Option>
                <Option value={1500}>$1500</Option>
                <Option value={2500}>$2500</Option>
                <Option value={5000}>$5000</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Primary or Non-Contributory Wording"
              name="withPrimaryOrNonContributoryWording"
              valuePropName="checked"
              tooltip="Indicates whether the policy includes primary or non-contributory wording for additional insureds"
            >
              <Select placeholder="Select option">
                <Option value={true}>Yes</Option>
                <Option value={false}>No</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Policy Per Occurrence Limit"
              name="policyPerOccurrenceLimit"
              tooltip="The maximum amount the policy will pay for any single occurrence or claim"
              rules={[
                { required: true, message: "Please enter occurrence limit" },
                {
                  type: "number",
                  min: 100000,
                  message: "Minimum limit is $100,000",
                },
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                placeholder="Enter occurrence limit"
                formatter={(value) =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Policy Aggregate Limit"
              name="policyAggregateLimit"
              tooltip="The maximum total amount the policy will pay for all claims during the policy period"
              rules={[
                { required: true, message: "Please enter aggregate limit" },
                {
                  type: "number",
                  min: 100000,
                  message: "Minimum limit is $100,000",
                },
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                placeholder="Enter aggregate limit"
                formatter={(value) =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider />

        {/* Risk Information */}
        <Title level={4}>Risk Information</Title>
        <Form.List name="risks">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Card
                  key={key}
                  size="small"
                  style={{ marginBottom: 16 }}
                  extra={
                    <Button
                      variant="ghost"
                      className="p-0 h-8 w-8"
                      onClick={() => remove(name)}
                    >
                      <DeleteOutlined className="w-4 h-4 mx-auto text-red-500" />
                    </Button>
                  }
                >
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        {...restField}
                        name={[name, "glClassCode"]}
                        label="GL Class Code"
                        tooltip="5-digit classification code that identifies the type of business or operation for rating purposes"
                        rules={[
                          {
                            required: true,
                            message: "Please select GL class code",
                          },
                        ]}
                      >
                        <Select
                          placeholder="Select GL class code"
                          showSearch
                          filterOption={(input, option) =>
                            !!option?.label
                              ?.toLowerCase()
                              .includes(input?.toLowerCase())
                          }
                          options={glClassCodesData.glClassCodes.map(
                            (code: { code: string; description: string }) => ({
                              value: code.code,
                              label: `${code.code} - ${code.description}`,
                            })
                          )}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        {...restField}
                        name={[name, "exposure"]}
                        label="Exposure"
                        tooltip="The basis for premium calculation, typically payroll, sales, or other exposure units"
                        rules={[
                          {
                            required: true,
                            message: "Please enter exposure",
                          },
                          {
                            type: "number",
                            min: 1,
                            message: "Exposure must be greater than 0",
                          },
                        ]}
                      >
                        <InputNumber
                          style={{ width: "100%" }}
                          placeholder="Enter exposure"
                          formatter={(value) =>
                            `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              ))}
              <Form.Item>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => add()}
                >
                  <PlusOutlined className="mr-2" />
                  Add Risk
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Divider />

        {/* Additional Insured */}
        <Title level={4}>Additional Insured</Title>
        <Form.List name="additionalInsured">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Card
                  key={key}
                  size="small"
                  style={{ marginBottom: 16 }}
                  extra={
                    <Button
                      variant="ghost"
                      className="p-0 h-8 w-8"
                      onClick={() => remove(name)}
                    >
                      <DeleteOutlined className="w-4 h-4 mx-auto text-red-500" />
                    </Button>
                  }
                >
                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item
                        {...restField}
                        name={[name, "form"]}
                        label="Form"
                        tooltip="The specific form number for additional insured coverage (e.g., CG2011 for Additional Insured - Owners, Lessees or Contractors)"
                        rules={[
                          { required: true, message: "Please enter form" },
                        ]}
                      >
                        <Input placeholder="Enter form (e.g., CG2011)" />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        {...restField}
                        name={[name, "numberOfInsureds"]}
                        label="Number of Insureds"
                        tooltip="The number of additional insured parties to be covered under this form"
                        rules={[
                          {
                            required: true,
                            message: "Please enter number of insureds",
                          },
                          {
                            type: "number",
                            min: 1,
                            message: "Must be at least 1",
                          },
                        ]}
                      >
                        <InputNumber
                          style={{ width: "100%" }}
                          placeholder="Enter number of insureds"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        {...restField}
                        name={[name, "wos"]}
                        label="WOS"
                        tooltip="Workers' Compensation and Employers' Liability (WOS) - number of workers covered"
                        rules={[
                          { required: true, message: "Please enter WOS" },
                          {
                            type: "number",
                            min: 1,
                            message: "Must be at least 1",
                          },
                        ]}
                      >
                        <InputNumber
                          style={{ width: "100%" }}
                          placeholder="Enter WOS"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              ))}
              <Form.Item>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => add()}
                >
                  <PlusOutlined className="mr-2" />
                  Add Additional Insured
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    );
  }
);

export default QuotesPage;
