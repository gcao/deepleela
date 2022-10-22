import * as React from 'react';
import { CSSProperties } from 'react';
import i18n from '../i18n';

interface EngineProps {
    engine?: string;
    onChange?: (e: any) => void;
}

export default class Engine extends React.Component<EngineProps, any> {

    render() {
        return (
          <select style={{ width: '100%' }} onChange={this.props.onChange} defaultValue={this.props.engine}>
            <option value="KataGoX:xu-100">KataGoX Xu 100 {i18n.aiLevel.strongest}</option>

            <option value="KataGoX:s23439424-d13434081">KataGoX 75</option>
            <option value="KataGoX:s23172608-d13319785">KataGoX 74</option>
            <option value="KataGoX:s22906496-d13208116">KataGoX 73</option>
            <option value="KataGoX:s21172736-d12529899">KataGoX 72</option>
            <option value="KataGoX:s40746624-d11963425">KataGoX 71</option>
            <option value="KataGoX:s40413184-d11733792">KataGoX 70</option>

            <option value="KataGo:xu-100">KataGo Xu 100</option>
            <option value="KataGo:s23439424-d13434081">KataGo 75</option>
            <option value="KataGo:s23172608-d13319785">KataGo 74</option>
            <option value="KataGo:s22906496-d13208116">KataGo 73</option>
            <option value="KataGo:s21172736-d12529899">KataGo 72</option>
            <option value="KataGo:s40746624-d11963425">KataGo 71</option>
            <option value="KataGo:s40413184-d11733792">KataGo 70</option>
            <option value="KataGo:s40080640-d11542882">KataGo 69</option>
            <option value="KataGo:s39415040-d11203900">KataGo 68</option>
            <option value="KataGo:s39148800-d11051308">KataGo 67</option>
            <option value="KataGo:s38882688-d10899161">KataGo 66</option>
            <option value="KataGo:s37169152-d10156350">KataGo 65</option>
            <option value="KataGo:s36889088-d10038372">KataGo 64</option>
            <option value="KataGo:s36335872-d9808736">KataGo 63</option>
            <option value="KataGo:s36064384-d9694347">KataGo 62</option>
            <option value="KataGo:s35788160-d9579671">KataGo 61</option>
            <option value="KataGo:s17324544-d9313956">KataGo 60</option>
            <option value="KataGo:s29096448-d8520277">KataGo 59</option>
            <option value="KataGo:s28731264-d8293612">KataGo 58</option>
            <option value="KataGo:s28096256-d8065839">KataGo 57</option>
            <option value="KataGo:s27462400-d7834755">KataGo 56</option>
            <option value="KataGo:s26842368-d7607189">KataGo 55</option>
            <option value="KataGo:s26578560-d7491279">KataGo 54</option>
            <option value="KataGo:s26316288-d7374800">KataGo 53</option>
            <option value="KataGo:s25689344-d7145883">KataGo 52</option>
            <option value="KataGo:s25358464-d7031902">KataGo 51</option>
            <option value="KataGo:s24627968-d6801221">KataGo 50</option>
            <option value="KataGo:s23540096-d6555060">KataGo 49</option>
            <option value="KataGo:s22476928-d6383159">KataGo 48</option>
            <option value="KataGo:s21923712-d6270832">KataGo 47</option>
            <option value="KataGo:s21570816-d6215256">KataGo 46</option>
            <option value="KataGo:s20945408-d5996552">KataGo 45</option>
            <option value="KataGo:s20411520-d5768001">KataGo 44</option>
            <option value="KataGo:s20144512-d5651555">KataGo 43</option>
            <option value="KataGo:s19877632-d5535464">KataGo 42</option>
            <option value="KataGo:s19500288-d5421211">KataGo 41</option>
            <option value="KataGo:s19110144-d5305068">KataGo 40</option>
            <option value="KataGo:s18852992-d5190371">KataGo 39</option>
            <option value="KataGo:s18563328-d5076623">KataGo 38</option>
            <option value="KataGo:s17405952-d4744022">KataGo 37</option>
            <option value="KataGo:s17047168-d4602037">KataGo 36</option>
            <option value="KataGo:s16085888-d4164005">KataGo 35</option>
            <option value="KataGo:s15832832-d4016039">KataGo 34</option>
            <option value="KataGo:s15579136-d3875110">KataGo 33</option>
            <option value="KataGo:s15325952-d3731791">KataGo 32</option>
            <option value="KataGo:s14939904-d3588306">KataGo 31</option>
            <option value="KataGo:s14586496-d3448502">KataGo 30</option>
            {/*
            <option value="KataGo:s13805312-d3160255">KataGo 29</option>
            <option value="KataGo:s13530240-d3016364">KataGo 28</option>
            <option value="KataGo:s12528000-d2717595">KataGo 27</option>
            <option value="KataGo:s12054144-d2599380">KataGo 26</option>
            <option value="KataGo:s11670656-d2481051">KataGo 25</option>
            <option value="KataGo:s11296256-d2359737">KataGo 24</option>
            <option value="KataGo:s10299264-d2109329">KataGo 23</option>
            <option value="KataGo:s10029824-d1986592">KataGo 22</option>
            <option value="KataGo:s9756928-d1864817">KataGo 21</option>
            <option value="KataGo:s9505280-d1743621">KataGo 20</option>
            <option value="KataGo:s8783872-d1620336">KataGo 19</option>
            <option value="KataGo:s8465024-d1496465">KataGo 18</option>
            <option value="KataGo:s7762560-d1372578">KataGo 17</option>
            <option value="KataGo:s7251456-d1247147">KataGo 16</option>
            <option value="KataGo:s6658560-d1120345">KataGo 15</option>
            <option value="KataGo:s6396416-d989141">KataGo 14</option>
            <option value="KataGo:s6145408-d850423">KataGo 13</option>
            <option value="KataGo:s5643520-d750502">KataGo 12</option>
            <option value="KataGo:s4947712-d653703">KataGo 11</option>
            <option value="KataGo:s4290944-d588493">KataGo 10</option>
            <option value="KataGo:s3785344-d522090">KataGo 09</option>
            <option value="KataGo:s3362304-d454629">KataGo 08</option>
            <option value="KataGo:s3022336-d392620">KataGo 07</option>
            <option value="KataGo:s2685056-d338903">KataGo 06</option>
            <option value="KataGo:s2311296-d283638">KataGo 05</option>
            <option value="KataGo:s1600128-d224253">KataGo 04</option>
            <option value="KataGo:s951936-d170159">KataGo 03</option>
            <option value="KataGo:s437376-d86279">KataGo 02</option>
            <option value="KataGo:s583680-d41745">KataGo 01 {i18n.aiLevel.notWorking}</option>
            */}
          </select>
        );
    }
}
