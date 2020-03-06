import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Keyboard, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

import api from '../../services/api';

import {
  Container,
  Form,
  Input,
  SubmitButton,
  List,
  User,
  Avatar,
  Name,
  Bio,
  ProfileButton,
  ProfileButtonText,
  RemoveProfileButton,
  RemoveProfileButtonText,
  TextNotFound,
} from './styles';

Icon.loadFont();

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newUser: '',
      users: [],
      loading: false,
    };
  }

  async componentDidMount() {
    const users = await AsyncStorage.getItem('users');

    if (users) {
      this.setState({ users: JSON.parse(users) });
    }
  }

  async componentDidUpdate(_, prevState) {
    const { users } = this.state;

    if (prevState.users !== users) {
      AsyncStorage.setItem('users', JSON.stringify(users));
    }
  }

  handleAddUser = async () => {
    const { users, newUser } = this.state;

    this.setState({ loading: true });

    try {
      if (newUser === '') {
        Alert.alert('Aviso', 'O campo não pode estar vazio!');
        return;
      }

      const response = await api.get(`/users/${newUser}`);

      const hasUsers = users.find(usr => usr.login === newUser);

      if (hasUsers) {
        Alert.alert('Aviso', 'Usuário ja está adicionado!');
        return;
      }

      const data = {
        name: response.data.name,
        login: response.data.login,
        bio: response.data.bio,
        avatar: response.data.avatar_url,
      };

      this.setState({
        users: [...users, data],
        newUser: '',
        loading: false,
      });

      Keyboard.dismiss();
    } catch (error) {
      Alert.alert('Aviso', 'Não foi possível buscar o usuário!');
    } finally {
      this.setState({ loading: false });
    }
  };

  handleNavigate = user => {
    const { navigation } = this.props;

    navigation.navigate('User', { user });
  };

  handleRemove = async user => {
    const { users } = this.state;
    const { login, name } = user;

    Alert.alert(
      'Deletar usuário',
      `Tem certeza que deseja deletar o usuario: ${name}`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Deletar',
          onPress: () =>
            this.setState({
              users: users.filter(usr => usr.login !== login),
            }),
        },
      ]
    );
  };

  render() {
    const { users, newUser, loading } = this.state;

    return (
      <Container>
        <Form>
          <Input
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Adicionar usuário"
            value={newUser}
            onChangeText={text => this.setState({ newUser: text })}
            returnKeyType="send"
            onSubmitEditing={this.handleAddUser}
          />
          <SubmitButton loading={loading} onPress={this.handleAddUser}>
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Icon name="add" size={20} color="#FFF" />
            )}
          </SubmitButton>
        </Form>
        {users ? (
          <List
            data={users}
            keyExtractor={user => user.login}
            renderItem={({ item }) => (
              <User>
                <Avatar source={{ uri: item.avatar }} />
                <Name>{item.name}</Name>
                <Bio>{item.bio}</Bio>

                <ProfileButton onPress={() => this.handleNavigate(item)}>
                  <ProfileButtonText>Ver Perfil</ProfileButtonText>
                </ProfileButton>
                <RemoveProfileButton onPress={() => this.handleRemove(item)}>
                  <RemoveProfileButtonText>Remover</RemoveProfileButtonText>
                </RemoveProfileButton>
              </User>
            )}
          />
        ) : (
          <TextNotFound>Nenhum Usuário Adicionado</TextNotFound>
        )}
      </Container>
    );
  }
}

Main.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

export default Main;
