import React, { useState, useEffect } from 'react'
import {
  Card,
  Steps,
  Tabs,
  Form,
  Input,
  Cascader,
  Button,
  Checkbox,
  Upload,
  message
} from 'antd'
import {
  FormOutlined,
  SnippetsOutlined,
  BookOutlined,
  PictureOutlined,
  ProjectOutlined,
  SmileOutlined,
  UploadOutlined
} from '@ant-design/icons'
import {
  goodsSort,
  sortParams,
  goodsAdd,
  goodsById,
  goodsUpdate
} from './service'
import { getToken } from '@/utils/auth'
import router from 'umi/router'
import useSyncCallback from '../useSyncCallback'
import Editor from '@/components/WangEditor'

const { Step } = Steps
const { TabPane } = Tabs

function Add({ location }) {
  const goodsId = location.query?.goodsId
  const [currentTab, setCurrentTab] = useState('1')
  const [activeTab, setActiveTab] = useState('1')
  const [formData, setFormData] = useState({})
  const [sortOptions, setSortOptions] = useState([])
  const [manyParams, setManyParams] = useState([])
  const [onlyParams, setOnlyParams] = useState([])

  const layout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 22 }
  }
  const [form] = Form.useForm()
  const stepOptions = [
    {
      key: '1',
      title: '基本信息',
      icon: <FormOutlined />
    },
    {
      key: '2',
      title: '商品参数',
      icon: <SnippetsOutlined />
    },
    {
      key: '3',
      title: '商品属性',
      icon: <BookOutlined />
    },
    {
      key: '4',
      title: '商品图片',
      icon: <PictureOutlined />
    },
    {
      key: '5',
      title: '商品内容',
      icon: <ProjectOutlined />
    },
    {
      key: '6',
      title: '操作完成',
      icon: <SmileOutlined />
    }
  ]
  const sortFieldProps = {
    label: 'cat_name',
    value: 'cat_id',
    children: 'children'
  }
  const uploadUrl = 'http://127.0.0.1:8888/api/private/v1/upload'
  const header = {
    Authorization: getToken()
  }

  const getSortId = sortArr => {
    if (sortArr && sortArr.length === 3) {
      return sortArr[2]
    }
    return null
  }

  useEffect(() => {
    getSortList({ type: 3 })
    if (goodsId) {
      getGoodsDetail(goodsId)
    }
  }, [])

  const getSortList = params => {
    goodsSort(params)
      .then(res => {
        setSortOptions(res.data)
      })
      .catch(err => console.log(err))
  }

  const getGoodsDetail = goodsId => {
    goodsById(goodsId)
      .then(res => {
        res.data.goods_cat = res.data.goods_cat.split(',')
        form.setFieldsValue({ ...res.data })
      })
      .catch(err => console.log(err))
  }

  const getSortInfo = (sortId, params) => {
    sortParams(sortId, params)
      .then(res => {
        if (params.sel === 'many') {
          res.data.length > 0 &&
            res.data.forEach(item => {
              item.attr_vals =
                item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
            })
          setManyParams(res.data)
        } else {
          setOnlyParams(res.data)
        }
      })
      .catch(err => console.log(err))
  }

  const handleCheckBox = (value, record) => {
    record.attr_vals = value
  }

  const handleUploadChange = res => {
    const img = []
    img.push({
      name: res.file.name,
      url: res.file.response?.data.url
    })
    setFormData({ ...formData, pics: img })
  }

  const onBack = () => {
    if (currentTab > 1) {
      setCurrentTab((Number(currentTab) - 1).toString())
      setActiveTab((Number(activeTab) - 1).toString())
    } else {
      setCurrentTab('1')
      setActiveTab('1')
    }
  }

  const onFinish = values => {
    setFormData({ ...formData, ...values })
    setCurrentTab((Number(currentTab) + 1).toString())
    setActiveTab((Number(activeTab) + 1).toString())
    handleFinish()
  }

  const handleFinish = useSyncCallback(() => {
    const cateId = getSortId(formData.goods_cat)
    if (Number(activeTab) === 2) {
      getSortInfo(cateId, { sel: 'many' })
    } else if (Number(activeTab) === 3) {
      getSortInfo(cateId, { sel: 'only' })
    } else if (Number(activeTab) === 6) {
      const attr = []
      manyParams &&
        manyParams.map(item => {
          attr.push({
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          })
        })
      onlyParams &&
        onlyParams.map(item => {
          attr.push({
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          })
        })
      setFormData({
        ...formData,
        goods_cat: formData.goods_cat.join(','),
        attrs: attr
      })
      handleSubmit()
    }
  })

  const handleSubmit = useSyncCallback(() => {
    if (goodsId) {
      handleGoodsUpdate(goodsId, formData)
    } else {
      handleGoodsAdd(formData)
    }
  })

  const handleGoodsAdd = data => {
    goodsAdd(data)
      .then(res => {
        message.success(res.meta.msg)
        router.push('/goods/list')
      })
      .catch(err => console.log(err))
  }

  const handleGoodsUpdate = (id, data) => {
    goodsUpdate(id, data)
      .then(res => {
        message.success(res.meta.msg)
        router.push('/goods/list')
      })
      .catch(err => console.log(err))
  }

  return (
    <div>
      <Card style={{ padding: '20px' }}>
        <Steps current={currentTab}>
          {stepOptions.map(item => (
            <Step key={item.key} title={item.title} icon={item.icon}></Step>
          ))}
        </Steps>

        <Tabs
          activeKey={activeTab}
          tabPosition="left"
          style={{ marginTop: '50px' }}
        >
          {stepOptions
            .filter(item => Number(item.key) < 6)
            .map(item => (
              <TabPane key={item.key} tab={item.title}>
                {(() => {
                  switch (item.key) {
                    case '1':
                      return (
                        <div>
                          <Form
                            {...layout}
                            labelAlign="left"
                            form={form}
                            onFinish={onFinish}
                          >
                            <Form.Item
                              label="商品名称"
                              name="goods_name"
                              rules={[
                                { required: true, message: '请输入商品名称' }
                              ]}
                            >
                              <Input />
                            </Form.Item>

                            <Form.Item
                              label="商品价格"
                              name="goods_price"
                              rules={[
                                { required: true, message: '请填写商品价格' }
                              ]}
                            >
                              <Input type="number" />
                            </Form.Item>

                            <Form.Item
                              label="商品重量"
                              name="goods_weight"
                              rules={[
                                { required: true, message: '请填写商品重量' }
                              ]}
                            >
                              <Input type="number" />
                            </Form.Item>

                            <Form.Item
                              label="商品数量"
                              name="goods_number"
                              rules={[
                                { required: true, message: '请填写商品数量' }
                              ]}
                            >
                              <Input type="number" />
                            </Form.Item>

                            <Form.Item
                              label="商品分类"
                              name="goods_cat"
                              rules={[
                                { required: true, message: '请选择商品分类' }
                              ]}
                            >
                              <Cascader
                                options={sortOptions}
                                expandTrigger="hover"
                                fieldNames={sortFieldProps}
                              />
                            </Form.Item>
                            <Form.Item>
                              <Button type="primary" htmlType="submit">
                                提交
                              </Button>
                            </Form.Item>
                          </Form>
                        </div>
                      )
                    case '2':
                      manyParams.forEach(item => {
                        const options = []
                        item.attr_vals.forEach(item => {
                          options.push({
                            label: item,
                            value: item
                          })
                        })
                        item.options = options
                      })

                      return (
                        <div>
                          <Form
                            {...layout}
                            labelAlign="left"
                            form={form}
                            onFinish={onFinish}
                          >
                            {manyParams.map(item => (
                              <Form.Item
                                label={item.attr_name}
                                key={item.attr_id}
                              >
                                <Checkbox.Group
                                  options={item.options}
                                  onChange={value =>
                                    handleCheckBox(value, item)
                                  }
                                />
                              </Form.Item>
                            ))}

                            <Form.Item>
                              <Button
                                style={{ marginRight: '10px' }}
                                onClick={onBack}
                              >
                                上一步
                              </Button>
                              <Button type="primary" htmlType="submit">
                                提交
                              </Button>
                            </Form.Item>
                          </Form>
                        </div>
                      )

                    case '3':
                      return (
                        <div>
                          <Form
                            labelCol={{ span: 3 }}
                            wrapperCol={{ span: 21 }}
                            labelAlign="left"
                            form={form}
                            onFinish={onFinish}
                          >
                            {onlyParams.map(item => (
                              <Form.Item
                                label={item.attr_name}
                                key={item.attr_id}
                              >
                                <Input value={item.attr_vals} />
                              </Form.Item>
                            ))}

                            <Form.Item>
                              <Button
                                style={{ marginRight: '10px' }}
                                onClick={onBack}
                              >
                                上一步
                              </Button>

                              <Button type="primary" htmlType="submit">
                                提交
                              </Button>
                            </Form.Item>
                          </Form>
                        </div>
                      )

                    case '4':
                      return (
                        <div>
                          <Form
                            {...layout}
                            labelAlign="left"
                            form={form}
                            onFinish={onFinish}
                          >
                            <Form.Item label="文件上传">
                              <Upload
                                action={uploadUrl}
                                headers={header}
                                onChange={handleUploadChange}
                              >
                                <Button>
                                  <UploadOutlined />
                                  点击上传
                                </Button>
                              </Upload>
                            </Form.Item>

                            <Form.Item>
                              <Button
                                style={{ marginRight: '10px' }}
                                onClick={onBack}
                              >
                                上一步
                              </Button>

                              <Button type="primary" htmlType="submit">
                                提交
                              </Button>
                            </Form.Item>
                          </Form>
                        </div>
                      )

                    case '5':
                      return (
                        <div>
                          <Form
                            {...layout}
                            labelAlign="left"
                            form={form}
                            onFinish={onFinish}
                          >
                            <Form.Item
                              label="商品内容"
                              name="goods_introduce"
                              rules={[
                                { required: true, message: '请添加商品介绍' }
                              ]}
                            >
                              <Editor />
                            </Form.Item>

                            <Form.Item>
                              <Button
                                style={{ marginRight: '10px' }}
                                onClick={onBack}
                              >
                                上一步
                              </Button>

                              <Button type="primary" htmlType="submit">
                                提交
                              </Button>
                            </Form.Item>
                          </Form>
                        </div>
                      )
                    default:
                      break
                  }
                })(item)}
              </TabPane>
            ))}
        </Tabs>
      </Card>
    </div>
  )
}

Add.displayName = 'Add'
export default Add
