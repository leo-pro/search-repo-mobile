import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator } from 'react-native';
import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
} from './styles';

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stars: [],
      loading: false,
      page: 1,
      refreshing: false,
    };
  }

  async componentDidMount() {
    this.load();
  }

  load = async (page = 1) => {
    const { stars } = this.state;

    const { route } = this.props;

    const { user } = route.params;

    this.setState({ loading: true });

    const response = await api.get(`/users/${user.login}/starred`, {
      params: { page },
    });

    this.setState({
      stars: page >= 2 ? [...stars, response.data] : response.data,
      page,
      loading: false,
      refreshing: false,
    });
  };

  handleStarredRepo = starredRepo => {
    const { navigation } = this.props;

    navigation.navigate('StarredRepo', { starredRepo });
  };

  refreshList = () => {
    this.setState({ refreshing: true, stars: [] }, this.load);
  };

  loadMore = () => {
    const { page } = this.state;

    const nextPage = page + 1;

    this.load(nextPage);
  };

  render() {
    const { route } = this.props;
    const { user } = route.params;
    const { stars, loading, refreshing } = this.state;

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>
        {loading ? (
          <ActivityIndicator size="large" color="#24292e" />
        ) : (
          <Stars
            data={stars}
            onRefresh={this.refreshList}
            refreshing={refreshing}
            keyExtractor={star => String(star.id)}
            renderItem={({ item }) => (
              <Starred onTouchEnd={() => this.handleStarredRepo(item)}>
                <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                <Info>
                  <Title>{item.name}</Title>
                  <Author>{item.owner.login}</Author>
                </Info>
              </Starred>
            )}
          />
        )}
      </Container>
    );
  }
}

User.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.object,
  }).isRequired,
};

User.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

export default User;
