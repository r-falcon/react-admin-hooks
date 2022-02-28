import React, { useState, useEffect } from 'react'
import { goodsSort, sortParams } from './service'
import { Card, Tabs, Table, Cascader } from 'antd'
import useSyncCallback from '../useSyncCallback'

const { TabPane } = Tabs
function Params() {
  const [cateId, setCateId] = useState(null)
  const [activeTab, setActiveTab] = useState('1')
  const [sortOptions, setSortOptions] = useState([])
  const [manyParams, setManyParams] = useState([])
  const [onlyParams, setOnlyParams] = useState([])

  const sortFieldProps = {
    label: 'cat_name',
    value: 'cat_id',
    children: 'children'
  }

  const getColumns = () => {
    return [
      {
        title: '序号',
        dataIndex: 'index',
        align: 'center',
        render: (text, record, index) => `${index + 1}`
      },
      {
        title: '参数名称',
        dataIndex: 'attr_name',
        align: 'center'
      },
      {
        title: '参数内容',
        dataIndex: 'attr_vals',
        align: 'center'
      }
    ]
  }

  const tabOptions = [
    {
      key: '1',
      title: '动态参数'
    },
    {
      key: '2',
      title: '静态属性'
    }
  ]

  useEffect(() => {
    getSortList({ type: 3 })
  }, [])

  const getSortList = params => {
    goodsSort(params)
      .then(res => {
        setSortOptions(res.data)
      })
      .catch(err => console.log(err))
  }

  const handleSortChange = value => {
    const sortId = getSortId(value)
    setCateId(sortId)
    handleRequest()
  }

  const getSortId = sortArr => {
    if (sortArr && sortArr.length === 3) {
      return sortArr[2]
    }
    return null
  }

  const handleRequest = useSyncCallback(() => {
    if (activeTab === '1') {
      getSortInfo(cateId, { sel: 'many' })
    } else {
      getSortInfo(cateId, { sel: 'only' })
    }
  })

  const getSortInfo = (sortId, params) => {
    sortParams(sortId, params)
      .then(res => {
        if (activeTab === '1') {
          setManyParams(res.data)
        } else {
          setOnlyParams(res.data)
        }
      })
      .catch(err => console.log(err))
  }

  const handleTabChange = value => {
    setActiveTab(value)
    handleRequest()
  }

  return (
    <div>
      <div>
        请选择商品分类：
        <Cascader
          options={sortOptions}
          expandTrigger="hover"
          fieldNames={sortFieldProps}
          placeholder="--请选择"
          onChange={handleSortChange}
        />
      </div>

      <Card>
        <Tabs activeKey={activeTab} onChange={handleTabChange}>
          {tabOptions.map(item => (
            <TabPane key={item.key} tab={item.title}>
              <Table
                bordered
                rowKey={record => record.attr_id}
                dataSource={Number(activeTab) === 1 ? manyParams : onlyParams}
                columns={getColumns()}
              />
            </TabPane>
          ))}
        </Tabs>
      </Card>
    </div>
  )
}

Params.displayName = 'Params'
export default Params
