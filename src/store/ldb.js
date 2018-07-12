
/**
 * layout store options
 */
import { objectType, getObjStorage } from 'utils/tool'
import { actionTypes, mutationTypes } from './types'
export default {
  namespaced: true,
  state: {
    historySearchLdbs: [],
    ldbs: [{
      '_id': '5b3f63518e04eb488c7294f9',
      'created_at': '2018-07-06T12:40:49.021Z',
      'update_at': '2018-07-06T12:40:49.021Z',
      'address': '上海市世纪大道1号',
      'ldbIcon': {
        '_id': '5b2b2e68c2e11d04c38aebb3',
        'sourceUrl': '/static/img/market/market-mingzhu.png',
        'mapImg': '/static/img/test/mingzhu.png'
      },
      '__v': 0,
      'ocs': 2,
      'tokenID': 0,
      'chainSystem': {
        'lng': 121.49471666667,
        'lat': 31.241669444444,
        'sellStatus': 1,
        'value': 68.88
      },
      'levelSystem': {
        'level': 5,
        'originLevel': 1
      },
      'tasks': [],
      'ldbType': 0,
      'photos': [],
      'desc': {
        'en': 'The Oriental Pearl Radio & Television Tower (Chinese: 东方明珠塔; pinyin: Dōngfāng Míngzhūtǎ; Shanghainese: Tonfon Mintsyta, official name: 东方明珠广播电视塔) is a TV tower in Shanghai. Its location at the tip of Lujiazui in the Pudong New Area by the side of Huangpu River, opposite The Bund, makes it a distinct landmark in the area. Its principal designers were Jiang Huan Chen, Lin Benlin, and Zhang Xiulin. Construction began in 1991, and the tower was completed in 1994.',
        'zh': '东方明珠广播电视塔，位于上海市浦东陆家嘴的未来主义建筑，与外滩隔黄浦江相望，原名上海广播电视塔，上海市民也常简称其为东方明珠。东方明珠由当时华东建筑设计研究院设计，1991年动工，1994年落成，总高468米。在1994年至2007年间，是中国大陆地区的最高建筑，2007年被上海环球金融中心超越。东方明珠自落成以后便成为上海天际线的组成部分之一，是上海的地标性建筑，同时也是中国国家5A级旅游景区。'
      },
      'origin': {
        'category': 'bus_station,transit_station,point_of_interest,establishment',
        'id': 'ChIJ9fYjX_twsjURpI5XytLaBZE',
        'region': ['5b3e430c73b9ae31c28d62b8', '5b3e43ce73b9ae31c28d6755', '5b3e43d073b9ae31c28d675e']
      },
      'name': {
        'en': '东方明珠',
        'zh': '东方明珠'
      },
      'user': {
        '_id': '5b1f8a352b97c33ed98d64e6',
        'address': '0x4cd98f82decade2d152e256efd1f8d5a334a3e28'
      }
    }, {
      '_id': '5b4371f4fcfa2257ca3216f71',
      'address': '上海市松江区松江唐经幢',
      'ldbIcon': {
        '_id': '5b2b2e68c2e11d04c38aebb3',
        'sourceUrl': '/static/img/market/market-tangjing.png',
        'mapImg': '/static/img/test/tangjing.png'
      },
      'ocs': 2,
      'tokenID': 1,
      'chainSystem': {
        'lng': 121.249104,
        'lat': 31.007386,
        'sellStatus': 0,
        'value': 38.98
      },
      'levelSystem': {
        'level': 3
      },
      'desc': {'zh': '和平饭店（Peace Hotel）是位于上海南京东路与外滩路口的一家饭店，其有南楼和北楼两栋历史建筑组成。饭店在1956年开业，接替原先已停业的华懋饭店继续使用沙逊大厦，即北楼。1965年原汇中饭店并入和平饭店，即南楼，地址分别为南京东路20号和23号。1965年至2010年之间，两座建筑共同作为“和平饭店”经营。1991年到1994年，和平饭店连续4个年度被评为“世界最著名饭店”，并至今仍是中国唯一一家被评为世界著名饭店的酒店。'
      },
      'origin': {},
      'name': {'zh': '上海松江唐经幢'
      },
      'user': {}
    }, {
      '_id': '5b4371f4fcfa2257ca3216f72',
      'address': '上海市世纪大道1号',
      'ldbIcon': {
        'sourceUrl': '/static/img/market/market-jinmao.png',
        'mapImg': '/static/img/test/mingzhu.png'
      },
      'ocs': 2,
      'tokenID': 2,
      'chainSystem': {
        'value': 58.88
      },
      'levelSystem': {
        'level': 4
      },
      'desc': {'zh': '和平饭店（Peace Hotel）是位于上海南京东路与外滩路口的一家饭店，其有南楼和北楼两栋历史建筑组成。饭店在1956年开业，接替原先已停业的华懋饭店继续使用沙逊大厦，即北楼。1965年原汇中饭店并入和平饭店，即南楼，地址分别为南京东路20号和23号。1965年至2010年之间，两座建筑共同作为“和平饭店”经营。1991年到1994年，和平饭店连续4个年度被评为“世界最著名饭店”，并至今仍是中国唯一一家被评为世界著名饭店的酒店。'
      },
      'origin': {},
      'name': {'zh': '上海金茂大厦'
      },
      'user': {}
    }, {
      '_id': '5b4371f4fcfa2257ca3216f73',
      'address': '南京东路20号',
      'ldbIcon': {
        'sourceUrl': '/static/img/market/market-huanqiu.png'
      },
      'ocs': 2,
      'tokenID': 3,
      'chainSystem': {
        'value': 48.88
      },
      'levelSystem': {
        'level': 4
      },
      'desc': {'zh': '和平饭店（Peace Hotel）是位于上海南京东路与外滩路口的一家饭店，其有南楼和北楼两栋历史建筑组成。饭店在1956年开业，接替原先已停业的华懋饭店继续使用沙逊大厦，即北楼。1965年原汇中饭店并入和平饭店，即南楼，地址分别为南京东路20号和23号。1965年至2010年之间，两座建筑共同作为“和平饭店”经营。1991年到1994年，和平饭店连续4个年度被评为“世界最著名饭店”，并至今仍是中国唯一一家被评为世界著名饭店的酒店。'
      },
      'origin': {},
      'name': {
        'zh': '坏球金融中心'
      },
      'user': {}
    }, {
      '_id': '5b4371f4fcfa2257ca3216f74',
      'address': '南京东路20号',
      'ldbIcon': {
        '_id': '5b3623cca7dbaa0eedd856ab',
        'sourceUrl': '/static/img/market/market-shanghaizhongxin.png'
      },
      'ocs': 2,
      'tokenID': 4,
      'chainSystem': {
        'value': 48.68
      },
      'levelSystem': {
        'level': 4
      },
      'desc': {'zh': '和平饭店（Peace Hotel）是位于上海南京东路与外滩路口的一家饭店，其有南楼和北楼两栋历史建筑组成。饭店在1956年开业，接替原先已停业的华懋饭店继续使用沙逊大厦，即北楼。1965年原汇中饭店并入和平饭店，即南楼，地址分别为南京东路20号和23号。1965年至2010年之间，两座建筑共同作为“和平饭店”经营。1991年到1994年，和平饭店连续4个年度被评为“世界最著名饭店”，并至今仍是中国唯一一家被评为世界著名饭店的酒店。'
      },
      'origin': {},
      'name': {'zh': '上海中心'
      },
      'user': {}
    }, {
      '_id': '5b4371f4fcfa2257ca3216f75',
      'address': '上海市黄浦区马当路388号',
      'ldbIcon': {
        '_id': '5b3623cca7dbaa0eedd856ab',
        'sourceUrl': '/static/img/market/market-dongfang.png'
      },
      'ocs': 2,
      'tokenID': 5,
      'chainSystem': {
        'value': 42.88
      },
      'levelSystem': {
        'level': 3
      },
      'desc': {'zh': '和平饭店（Peace Hotel）是位于上海南京东路与外滩路口的一家饭店，其有南楼和北楼两栋历史建筑组成。饭店在1956年开业，接替原先已停业的华懋饭店继续使用沙逊大厦，即北楼。1965年原汇中饭店并入和平饭店，即南楼，地址分别为南京东路20号和23号。1965年至2010年之间，两座建筑共同作为“和平饭店”经营。1991年到1994年，和平饭店连续4个年度被评为“世界最著名饭店”，并至今仍是中国唯一一家被评为世界著名饭店的酒店。'
      },
      'origin': {},
      'name': {'zh': '东方财富大厦'
      },
      'user': {}
    }, {
      '_id': '5b4371f4fcfa2257ca3216f76',
      'address': '南京东路20号',
      'ldbIcon': {
        '_id': '5b3623cca7dbaa0eedd856ab',
        'sourceUrl': '/static/img/market/market-zhongbao.png'
      },
      'ocs': 2,
      'tokenID': 6,
      'chainSystem': {
        'value': 39.99
      },
      'levelSystem': {
        'level': 3
      },
      'desc': {'zh': '和平饭店（Peace Hotel）是位于上海南京东路与外滩路口的一家饭店，其有南楼和北楼两栋历史建筑组成。饭店在1956年开业，接替原先已停业的华懋饭店继续使用沙逊大厦，即北楼。1965年原汇中饭店并入和平饭店，即南楼，地址分别为南京东路20号和23号。1965年至2010年之间，两座建筑共同作为“和平饭店”经营。1991年到1994年，和平饭店连续4个年度被评为“世界最著名饭店”，并至今仍是中国唯一一家被评为世界著名饭店的酒店。'
      },
      'origin': {},
      'name': {'zh': '中国保险大厦'
      },
      'user': {}
    }, {
      '_id': '5b4371f4fcfa2257ca3216f77',
      'address': '南京东路20号',
      'ldbIcon': {
        '_id': '5b3623cca7dbaa0eedd856ab',
        'sourceUrl': '/static/img/market/market-balin.png'
      },
      'ocs': 2,
      'tokenID': 7,
      'chainSystem': {
        'value': 19.99
      },
      'levelSystem': {
        'level': 2
      },
      'desc': {'zh': '和平饭店（Peace Hotel）是位于上海南京东路与外滩路口的一家饭店，其有南楼和北楼两栋历史建筑组成。饭店在1956年开业，接替原先已停业的华懋饭店继续使用沙逊大厦，即北楼。1965年原汇中饭店并入和平饭店，即南楼，地址分别为南京东路20号和23号。1965年至2010年之间，两座建筑共同作为“和平饭店”经营。1991年到1994年，和平饭店连续4个年度被评为“世界最著名饭店”，并至今仍是中国唯一一家被评为世界著名饭店的酒店。'
      },
      'origin': {},
      'name': {'zh': '巴林小区'
      },
      'user': {}
    }, {
      '_id': '5b4371f4fcfa2257ca3216f78',
      'address': '南京东路20号',
      'ldbIcon': {
        '_id': '5b3623cca7dbaa0eedd856ab',
        'sourceUrl': '/static/img/market/market-hengsheng.png'
      },
      'ocs': 2,
      'tokenID': 8,
      'chainSystem': {
        'value': 38.89
      },
      'levelSystem': {
        'level': 3
      },
      'desc': {'zh': '和平饭店（Peace Hotel）是位于上海南京东路与外滩路口的一家饭店，其有南楼和北楼两栋历史建筑组成。饭店在1956年开业，接替原先已停业的华懋饭店继续使用沙逊大厦，即北楼。1965年原汇中饭店并入和平饭店，即南楼，地址分别为南京东路20号和23号。1965年至2010年之间，两座建筑共同作为“和平饭店”经营。1991年到1994年，和平饭店连续4个年度被评为“世界最著名饭店”，并至今仍是中国唯一一家被评为世界著名饭店的酒店。'
      },
      'origin': {},
      'name': {'zh': '恒生银行大厦'
      },
      'user': {}
    }, {
      '_id': '5b4371f4fcfa2257ca3216f79',
      'address': '南京东路20号',
      'ldbIcon': {
        '_id': '5b3623cca7dbaa0eedd856ab',
        'sourceUrl': '/static/img/market/market-qianxuesen.png'
      },
      'ocs': 2,
      'tokenID': 9,
      'chainSystem': {
        'value': 29.99
      },
      'levelSystem': {
        'level': 3
      },
      'desc': {'zh': '和平饭店（Peace Hotel）是位于上海南京东路与外滩路口的一家饭店，其有南楼和北楼两栋历史建筑组成。饭店在1956年开业，接替原先已停业的华懋饭店继续使用沙逊大厦，即北楼。1965年原汇中饭店并入和平饭店，即南楼，地址分别为南京东路20号和23号。1965年至2010年之间，两座建筑共同作为“和平饭店”经营。1991年到1994年，和平饭店连续4个年度被评为“世界最著名饭店”，并至今仍是中国唯一一家被评为世界著名饭店的酒店。'
      },
      'origin': {},
      'name': {'zh': '钱学森故居'
      },
      'user': {}
    }, {
      '_id': '5b43241127e1ac57ae12d6bb',
      'address': '上海市静安区静安寺',
      'ldbIcon': {
        '_id': '5b1642ac940f241cebc0b712',
        'sourceUrl': '/static/img/market/market-dongmeite.png'
      },
      'ocs': 2,
      'tokenID': 10,
      'chainSystem': {
        'lng': 121.443871,
        'lat': 31.224133,
        'sellStatus': 1,
        'value': 15.68
      },
      'levelSystem': {
        'level': 2,
        'originLevel': 1
      },
      'desc': {
        'en': "Jing'an Temple (Chinese: 静安寺; pinyin: Jìng'ān Sì; Shanghainese: Zin'ue Zy; literally: \"Temple of Peace and Tranquility\") is a Buddhist temple on the West Nanjing Road in Shanghai, China. Jing'an District, where it is located, is named after the temple.",
        'zh': '静安寺是一座佛教寺庙，位于中国上海市静安区南京西路1686号，其历史可以追溯到公元3世纪的三国时期，是中国江南地区历史悠久、颇具影响的名刹之一。'
      },
      'origin': {
        'category': 'neighborhood,political',
        'id': 'ChIJ16Hy2wFwsjURysY5eefu18k',
        'region': ['5b3e430c73b9ae31c28d62b8', '5b3e43ce73b9ae31c28d6755', '5b3e43d273b9ae31c28d6765']
      },
      'name': {
        'en': "Jing'an Temple",
        'zh': '东美特公寓'
      },
      'user': {
        '_id': '5b1f8a352b97c33ed98d64e6',
        'address': '0x4cd98f82decade2d152e256efd1f8d5a334a3e28'
      }
    }, {
      '_id': '5b4371f4fcfa2257ca3216f70',
      'address': '南京东路20号',
      'ldbIcon': {
        '_id': '5b3623cca7dbaa0eedd856ab',
        'sourceUrl': '/static/img/market/market-libao.png'
      },
      'ocs': 2,
      'tokenID': 11,
      'chainSystem': {
        'lng': 121.4895427,
        'lat': 31.2390388,
        'sellStatus': 0,
        'value': 128.88
      },
      'levelSystem': {
        'level': 3,
        'originLevel': 1
      },
      'desc': {
        'en': 'The Peace Hotel (Chinese: 和平饭店) is a hotel on The Bund in Shanghai, China, which overlooks the surrounding areas.The hotel has two different buildings. The Sassoon House, originally housed the Cathay Hotel and is today the Fairmont Peace Hotel run by Fairmont Hotels and Resorts of Canada. The South Building was built as the Palace Hotel and is today the Swatch Art Peace Hotel. The two buildings both face the Bund, but are divided by Nanjing Road.',
        'zh': '和平饭店（Peace Hotel）是位于上海南京东路与外滩路口的一家饭店，其有南楼和北楼两栋历史建筑组成。饭店在1956年开业，接替原先已停业的华懋饭店继续使用沙逊大厦，即北楼。1965年原汇中饭店并入和平饭店，即南楼，地址分别为南京东路20号和23号。1965年至2010年之间，两座建筑共同作为“和平饭店”经营。1991年到1994年，和平饭店连续4个年度被评为“世界最著名饭店”，并至今仍是中国唯一一家被评为世界著名饭店的酒店。'
      },
      'origin': {
        'category': 'lodging,point_of_interest,establishment',
        'id': 'ChIJ070dKpmLrTURKJlpICBYzKE',
        'region': ['5b3e430c73b9ae31c28d62b8', '5b3e43ce73b9ae31c28d6755', '5b3e43d073b9ae31c28d675e']
      },
      'name': {
        'en': 'Fairmont Peace Hotel',
        'zh': '上海力宝广场'
      },
      'user': {
        '_id': '5b1f8a352b97c33ed98d64e6',
        'address': '0x4cd98f82decade2d152e256efd1f8d5a334a3e28'
      }
    }]
  },
  mutations: {

    /**
     * 获取 ldb记录信息
     * 如果 state.historySearchLdbs 为空，则从localStorage中获得
     */
    [mutationTypes.LDB_GET_HISTORY_SEARCH_LDBS]: (state) => {
      let historySearchLdbs = state.historySearchLdbs
      if (!historySearchLdbs.length) {
        historySearchLdbs = getObjStorage('lordless_search_ldbs', 'array')
        state.historySearchLdbs = historySearchLdbs
      }
      return historySearchLdbs
    },

    /**
     * 存储 ldb搜索记录
     * 记录最多存储10条，多于10条，移除最后的那一条
     */
    [mutationTypes.LDB_SET_HISTORY_SEARCH_LDB]: (state, payload) => {
      if (objectType(payload)[0] !== 'object') return false

      // 拿到建筑数据
      const ldbs = state.historySearchLdbs || getObjStorage('lordless_search_ldbs', 'array')

      // 遍历判断是否重复信息
      ldbs.map((item, index) => {
        if (item._id === payload._id) ldbs.splice(index, 1)
      })

      // 存储的信息，添加记录标记
      payload = Object.assign({}, payload, {
        history: 1
      })
      ldbs.unshift(payload)
      if (ldbs.length > 10) ldbs.pop()
      state.historySearchLdbs = ldbs
      window.localStorage.setItem('lordless_search_ldbs', JSON.stringify(ldbs))
    }
  },
  actions: {

    /**
     * 存储 单条ldb信息 到本地
     */
    [actionTypes.LDB_SET_HISTORY_SEARCH_LDB]: ({ commit }, payload) => {
      commit(mutationTypes.LDB_SET_HISTORY_SEARCH_LDB, payload)
    },

    /**
     * 获取本地 ldb 查询记录
     */
    [actionTypes.LDB_GET_HISTORY_SEARCH_LDBS]: ({ commit }) => {
      return commit(mutationTypes.LDB_GET_HISTORY_SEARCH_LDBS)
    }
  }
}
